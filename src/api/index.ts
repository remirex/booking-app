import { Router } from 'express';

import items from './routes/example/item';
import rooms from './routes/room';

export default () => {
  const app = Router();

  items(app);
  rooms(app);

  return app;
};
