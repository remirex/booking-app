import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Item from '@/services/item';
import { IItemInputDTO } from '@/interfaces/IItem';

const route = Router();

export default (app: Router) => {
  app.use('/item', route);

  const itemServiceInstance = Container.get(Item);

  route.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await itemServiceInstance.createItem(req.body as IItemInputDTO);
      return res.status(201).json(response);
    } catch (err) {
      return next(err);
    }
  });
};