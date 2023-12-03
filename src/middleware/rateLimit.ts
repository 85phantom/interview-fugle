import { RedisClientType, createClient } from 'redis';
import { promises as fs } from 'fs';
import config from 'config';
import { TooManyRequestError } from '../error';

const rateLimit = () => {
  return async function (req, res, next) {
    try {
      const ip = req.ip as string;
      const user = req.query.user.toString();
      const redisUrl =
        'redis://' + config.get('redis.host') + ':' + config.get('redis.port');

      const redisClient = await createClient({
        url: redisUrl,
      }).connect();

      const period = config.get('rateLimit.period').toString();

      await countPeriodRequests(user, ip, period, redisClient);

      await redisClient.disconnect();
      next();
    } catch (error) {
      next(error);
    }
  };
};

async function countPeriodRequests(
  userId: string,
  userIp: string,
  period: string,
  redisClient,
) {
  const userIdKey = 'id:' + userId;
  const userIpKey = 'ip:' + userIp;
  const unixTimeNowStr = Math.floor(Date.now() / 1000).toString();
  const filePath = config.get('lua.path');
  const countRequestLuaScript = await fs.readFile(filePath, 'utf-8');

  const idRequestCount = (
    await redisClient.eval(countRequestLuaScript, {
      keys: [userIdKey],
      arguments: [unixTimeNowStr, period],
    })
  )[0];
  const ipRequestCount = (
    await redisClient.eval(countRequestLuaScript, {
      keys: [userIpKey],
      arguments: [unixTimeNowStr, period],
    })
  )[0];

  const ipLimit = config.get('rateLimit.ipLimit');
  const idLimit = config.get('rateLimit.idLimit');

  if (idRequestCount > idLimit || ipRequestCount > ipLimit) {
    throw new TooManyRequestError(
      'send too many requests in one minute',
      'Request too often',
      {
        id: idRequestCount,
        ip: ipRequestCount,
      },
      {},
      {},
    );
  }
}

export default rateLimit;
