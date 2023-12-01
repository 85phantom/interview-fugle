import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from './error';
import config from 'config';

export async function getDivisibleNumbers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.query.user;
    if (userId < 1 || userId > 1000)
      throw new ValidationError(
        'user id is not invalid',
        'UserIdInvalid',
        { userId },
        {},
        {},
      );
    const divisibleNumbersUrl = config.get('divisibleNumber.url');

    const result = await axios.request({
      url: divisibleNumbersUrl,
      method: 'GET',
    });

    const numberList = result.data;
    const divisibleNumbers = divisibleNumbersByUserId(userId, numberList);

    return res.status(200).json({ result: divisibleNumbers });
  } catch (error) {
    next(error);
  }
}

function divisibleNumbersByUserId(
  userId: number,
  numberList: number[],
): number[] {
  return numberList.filter((number) => number % userId == 0);
}
