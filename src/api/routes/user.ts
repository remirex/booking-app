import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import FileService from '../../services/files/upload';
import Upload from '../middleware/upload';
import Auth from '../middleware/auth';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  const fileServiceContainer = Container.get(FileService);
  const uploadMiddlewareInstance = Container.get(Upload);
  const authMiddlewareInstance = Container.get(Auth);
  const logger: Logger = Container.get('logger');

  route.put(
    '/upload-avatar/:id',
    authMiddlewareInstance.authMiddleware(),
    uploadMiddlewareInstance.uploadImage().single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Upload Avatar endpoint');
      try {
        const filePath = req.file?.path;
        const fileName = req.file?.filename;
        const fileDestination = req.file?.destination;
        const userId = req.params.id;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/images/resized`;

        await uploadMiddlewareInstance.resizeImage(filePath, fileName, fileDestination);

        const response = await fileServiceContainer.uploadAvatarImg(fileName, userId, basePath, req.file!);
        return res.status(200).json(response);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
  route.post(
    '/upload-files/:id',
    authMiddlewareInstance.authMiddleware(),
    uploadMiddlewareInstance.uploadImage(true, 3).array('files', 3),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Upload Multiple File endpoint');
      try {
        await fileServiceContainer.uploadFiles(req.params.id, req.files!);
        return res.status(200).json(true);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
  route.put(
    '/upload-file/:id',
    authMiddlewareInstance.authMiddleware(),
    uploadMiddlewareInstance.uploadFile().single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Upload File endpoint');
      try {
        const fileName = req.file?.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
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
