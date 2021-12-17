import { Router } from 'express';

import items from './routes/example/item';
import rooms from './routes/room';
import auth from './routes/auth/auth';
import user from './routes/user';

export default () => {
  const app = Router();

  items(app);
  rooms(app);
  auth(app);
  user(app);
  return app;
};
