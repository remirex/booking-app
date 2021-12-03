import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../middleware';

export function twoFACodeSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    code: joi.string().required(),
  });
  middleware.validation(req, res, next, schema);
}
