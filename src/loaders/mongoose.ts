import mongoose, { ConnectOptions } from 'mongoose';
import { Db } from 'mongodb';

import config from '../config';

// local development
const url = `mongodb://${config.mongo.mongoHostname}:${config.mongo.mongoPort}/${config.mongo.mongoDatabase}`;

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  return connection.connection.db;
};
