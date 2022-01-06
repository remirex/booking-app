import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected!');

  const itemModel = {
    name: 'itemModel',
    // Notice the require syntax and the '.default'
    model: require('../models/item').default,
  };

  const roomModel = {
    name: 'roomModel',
    model: require('../models/room').default,
  };

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  const refreshTokenModel = {
    name: 'refreshTokenModel',
    model: require('../models/refreshToken').default,
  };

  const uploadModel = {
    name: 'uploadModel',
    model: require('../models/upload').default,
  };

  await dependencyInjectorLoader({
    mongoConnection,
    models: [itemModel, roomModel, userModel, refreshTokenModel, uploadModel],
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
