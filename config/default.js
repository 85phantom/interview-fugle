const path = require('path');

const config = {
  divisibleNumber: {
    url: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  lua: {
    path: path.normalize(
      path.join(__dirname, '../src/middleware/countRequest.lua'),
    ),
  },
  rateLimit: {
    ipLimit: 10,
    idLimit: 5,
    period: 60, // 60 sec = 1 min
  },
  bitstamp: {
    currencyPairs: [
      'btcusd',
      'btceur',
      'btcgbp',
      'btcpax',
      'gbpusd',
      'eurusd',
      'xrpusd',
      'xrpeur',
      'xrpbtc',
      'xrpgbp',
    ],
  },
};
module.exports = config;
