import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../middleware';

export function addRoomSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    floor: joi.number().required(),
    capacity: joi.number(),
  });
  middleware.validation(req, res, next, schema);
}
