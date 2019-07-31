const winston = require('../config/winston');
const environment = require('../config/environment');


const logger = winston.createLogger(environment.logger);

module.exports = logger;
