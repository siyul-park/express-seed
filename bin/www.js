const app = require('../app');
const config = require('../app/config/environment');
const db = require('../model');


Promise.resolve(db.sequelize.sync())
  .then(() => {
    if (!module.parent) {
      app.listen(config.port, () => {
        config.logger.log(`API server listening on ${config.host}:${config.port}, in ${config.env}`);
      });
    }
  });
