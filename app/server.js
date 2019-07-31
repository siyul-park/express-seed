const app = require('./index');
const config = require('./config/environment');
const logger = require('./logger');
const db = require('../model');

function run(masterId = null, workerId = null) {
  Promise.resolve(db.sequelize.sync())
    .then(() => {
      app.listen(config.port, config.host, () => {
        let message = masterId ? `Server[${masterId}-${workerId}] ` : '';
        message += `API server listening on http://${config.host}:${config.port}, in ${config.env}`;

        logger.info(message);
      });
    })
    .catch(reason => logger.error(reason));
}

module.exports = { run };
