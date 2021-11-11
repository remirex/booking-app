import { Router } from 'express';

import items from './routes/example/item';

export default () => {
  const app = Router();

  items(app);

  return app;
};
