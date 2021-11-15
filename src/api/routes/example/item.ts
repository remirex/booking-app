import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Item from '../../../services/item';
import { IItemInputDTO } from '../../../interfaces/IItem';
import request from '../../requests';

const route = Router();

export default (app: Router) => {
  app.use('/item', route);

  const itemServiceInstance = Container.get(Item);

  route.post('/create', request.createItemSchema, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await itemServiceInstance.createItem(req.body as IItemInputDTO);
      return res.status(201).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = req.params.id;
      const response = await itemServiceInstance.getItem(itemId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = req.params.id;
      const response = await itemServiceInstance.updateItem(itemId, req.body as IItemInputDTO);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = req.params.id;
      const response = await itemServiceInstance.deleteItem(itemId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
