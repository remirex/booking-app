import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import Room from '../../services/room';
import { IRoomInputDTO } from '../../interfaces/IRoom';
import bodyRequest from '../requests';

const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const roomServiceInstance = Container.get(Room);

  route.post('/add', bodyRequest.addRoomSchema, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await roomServiceInstance.addNewRoom(req.body as IRoomInputDTO);
      return res.status(201).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
