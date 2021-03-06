require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const logger = require('./logger');

const loggingFunction = (msg, object) => {
  logger.info({ action: msg, binds: object.bind });
}

const loggingState = process.env.NODE_ENV === 'test' ? false : loggingFunction;

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql',
  storage: './__tests/database.sqlite',
  define: {
    timestamps: true
  },
  logging: loggingState,
};