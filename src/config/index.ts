import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT!, 10),

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  mongo: {
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoHostname: process.env.MONGO_HOSTNAME,
    mongoPort: process.env.MONGO_PORT,
    mongoDatabase: process.env.MONGO_DB,
  },

  api: {
    prefix: '/api/v1',
  },

  jwtSecret: String(process.env.JWT_SECRET),
  jwtAlgorithm: String(process.env.JWT_ALGO),

  emails: {
    user: String(process.env.EMAIL_USER),
    pass: String(process.env.EMAIL_PASS),
    from: String(process.env.EMAIL_FROM),
    host: String(process.env.EMAIL_HOST),
    port: Number(process.env.EMAIL_PORT),
  },

  clientUrl: process.env.CLIENT_URI,
};
