const app = require('../app');
const config = require('../app/config/environment');
const Logger = require('../app/logger');

const logger = new Logger(config.logger);

app.listen(config.port, () => {
  logger.log(`Express server has started on port ${config.port}`);
});
