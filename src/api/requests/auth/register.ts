import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../middleware';

export function registerSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi
    .object({
      name: joi.string().required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } })
        .required(),
      username: joi.string().alphanum().min(3).max(30).required(),
      password: joi.string().required().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      repeatPassword: joi.ref('password'),
      acceptTerms: joi.boolean().required().invalid(false),
    })
    .with('password', 'repeatPassword');
  middleware.validation(req, res, next, schema);
}
