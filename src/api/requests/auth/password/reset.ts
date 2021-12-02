import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middleware';

export function resetSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi
    .object({
      token: joi.string().required(),
      password: joi.string().required().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      repeatPassword: joi.ref('password'),
    })
    .with('password', 'repeatPassword');
  middleware.validation(req, res, next, schema);
}
