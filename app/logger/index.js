class Logger {
  constructor(logger) {
    this.logger = logger;
  }

  log(content) {
    if (this.logger) this.logger.log(content);
  }
}

module.exports = Logger;
