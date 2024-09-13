import { NextFunction, Request, Response } from "express";

export const SLValidator = (req: Request, res: Response, next: NextFunction) => {
  const headerKeys = Object.keys(req.headers);
  const userAgent = req.headers["user-agent"];
// 'user-agent': 'Second-Life-LSL/2023-04-21.579747 (https://secondlife.com)',
//  'x-secondlife-owner-name': 'Fallen Kiyori',
//  pragma: 'no-cache',
//  'x-secondlife-object-name': 'Object',
//  'x-secondlife-local-velocity': '(0.000000, 0.000000, 0.000000)',
//  'x-secondlife-shard': 'Production',
//  'x-secondlife-owner-key': 'e6e73511-8a2c-4a11-acf6-6adeba0b99f9',
//  'x-secondlife-object-key': '34b2915a-bbe9-d0ba-1599-27910c98c5b5',
//  'x-secondlife-region': 'Snoozybear (267520, 245504)',
//  'x-secondlife-local-position': '(238.781464, 156.248764, 1994.004761)',
  const secondlifeHeaders = headerKeys.filter((key) => key.toLowerCase().startsWith('x-secondlife-'));

  if (secondlifeHeaders.length === 0 && !userAgent.startsWith('Second-Life-LSL')) {
    return res.status(400).json({message: 'Bad request'});
  }

  next(); // pass the request on.
};
