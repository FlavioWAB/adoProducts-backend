require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const logger = require('../config/logger');

module.exports = function (err) {
    if(process.env.NODE_ENV === 'test') return;
    err.errors.forEach(error => logger.error({ action: error.message, context: error }));
}