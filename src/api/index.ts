import { Router } from 'express';

import items from './routes/example/item';
import rooms from './routes/room';
import authorization from './routes/auth/authorization';

export default () => {
  const app = Router();

  items(app);
  rooms(app);
  authorization(app);

  return app;
};
