const app = require('./index');
const config = require('./config/environment');
const db = require('../model');

function run() {
  Promise.resolve(db.sequelize.sync())
    .then(() => {
      app.listen(config.port, config.host, () => {
        config.logger.log(`API server listening on http://${config.host}:${config.port}, in ${config.env}`);
      });
    })
    .catch(reason => config.logger.warn(reason));
}

module.exports = { run };
