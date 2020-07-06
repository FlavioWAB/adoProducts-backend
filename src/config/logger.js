const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    if(level === 'error') return `${timestamp} ERROR reason: "${message.action.replace('Executing (default): ', '')}" context:${JSON.stringify(message.context)}`;
    return `${timestamp} ${level.toUpperCase()} action: "${message.action.replace('Executing (default): ', '')}" ${message.binds ? `binds: ${JSON.stringify(message.binds)}` : ''}`;
});

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({
            filename: 'database.log',
            level: 'info',
            json: true,
        })
    ],
});

module.exports = logger;