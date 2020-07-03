
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} action: "${message.action.replace('Executing (default): ','')}" ${message.binds ? `binds: ${JSON.stringify(message.binds)}` : ''}`;
});

const logger = winston.createLogger({
  format:combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new (winston.transports.Console)(),
    new winston.transports.File({
      filename: 'database.log',
      level: 'info',
      json: true,
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      json: true,
    })
  ],

});

module.exports = {
  username: 'b782ebe8262142',
  password: '4b88a6de',
  database: 'heroku_3d1ff094360713b',
  host: 'us-cdbr-east-02.cleardb.com',
  dialect: 'mysql',
  define: {
    timestamps: true
  },
  logging: (msg, object) => {
    console.log('msg', msg, 'object', object.bind);
    logger.info({action: msg, binds: object.bind});
  },
};