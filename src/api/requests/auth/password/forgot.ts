import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middleware';

export function forgotSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } })
      .required(),
  });
  middleware.validation(req, res, next, schema);
}
