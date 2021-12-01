import { Container } from 'typedi';
import nodemailer from 'nodemailer';

import config from '../config';
import LoggerInstance from './logger';
import Password from '../services/users/password';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);

    Container.set('password', Password);

    Container.set(
      'emailClient',
      nodemailer.createTransport({
        host: config.emails.host,
        port: config.emails.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.emails.user,
          pass: config.emails.pass,
        },
      }),
    );
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
