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

  await dependencyInjectorLoader({
    mongoConnection,
    models: [itemModel],
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
