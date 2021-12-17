import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import FileService from '../../services/files/upload';
import middleware from '../middleware';
import Upload from '../middleware/upload';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  const fileServiceContainer = Container.get(FileService);
  const uploadMiddlewareInstance = Container.get(Upload);
  const logger: Logger = Container.get('logger');

  route.put(
    '/upload-avatar/:id',
    uploadMiddlewareInstance.uploadImage().single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Upload Avatar endpoint');
      try {
        const fileName = req.file?.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/images/`;
        const userId = req.params.id;
        const response = await fileServiceContainer.uploadAvatarImg(fileName, userId, basePath, req.file!);
        return res.status(200).json(response);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
  route.post(
    '/upload-multiple',
    uploadMiddlewareInstance.uploadImage(true, 3).array('images', 3),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(200).json(true);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
  route.put(
    '/upload-file/:id',
    middleware.fileUpload2.single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Upload File endpoint');
      try {
        const fileName = req.file?.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const userId = req.params.id;
        const response = await fileServiceContainer.uploadFile(fileName, userId, basePath, req.file!);
        return res.status(200).json(response);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
};
