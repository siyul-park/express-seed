const app = require('../app');
const config = require('../app/config/environment');
const Logger = require('../app/logger');
const db = require('../model');


const logger = new Logger(config.logger);

Promise.resolve(db.sequelize.sync())
  .then(() => {
    if (!module.parent) {
      app.listen(config.port, () => {
        logger.log(`API server listening on ${config.host}:${config.port}, in ${config.env}`);
      });
    }
  });
