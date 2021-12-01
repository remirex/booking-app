import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../middleware';

export function loginSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } })
      .required(),
    password: joi.string().required().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  });
  middleware.validation(req, res, next, schema);
}
