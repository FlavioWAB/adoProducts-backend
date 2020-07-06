require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const WinstonTransportSequelize = require('winston-transport-sequelize');
const Sequelize = require('sequelize');

const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    storage: './__tests/database.sqlite',
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const options = {
    sequelize: sequelize,
    tableName: 'WinstonLog',
    meta: { project: 'myProject' },
    level: 'info'
}

const myFormat = printf(({ level, message, timestamp }) => {
    if (level === 'error') return `${timestamp} ERROR reason: "${message.action.replace('Executing (default): ', '')}" context:${JSON.stringify(message.context)}`;
    return `${timestamp} ${level.toUpperCase()} action: "${message.action.replace('Executing (default): ', '')}" ${message.binds ? `binds: ${JSON.stringify(message.binds)}` : ''}`;
});

const logger = winston.createLogger({
    transports: [
        new WinstonTransportSequelize(options)
    ],
});

module.exports = logger;