const logger = require('../config/logger');

module.exports = function (err) {
    err.errors.forEach(error => logger.error({ action: error.message, context: error }));
}