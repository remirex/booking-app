import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../middleware';

export function tokenSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi
    .object({
      token: joi.string().required(),
    })
    .with('password', 'repeatPassword');
  middleware.validation(req, res, next, schema);
}
