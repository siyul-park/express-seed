const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

function createTransport(type, option) {
  switch (type) {
    case 'console':
      return new winston.transports.Console(option);
    case 'file':
      return new winston.transports.DailyRotateFile(
        Object.assign(
          { zippedArchive: true },
          option,
        ),
      );
    default:
  }
}

function createLogger(loggerConfig) {
  if (!loggerConfig) return;

  const options = {
    format: winston.format.printf(
      info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`,
    ),
    transports: [],
  };

  if (loggerConfig.level) options.level = loggerConfig.level;

  if (loggerConfig.transports) {
    for (const transport of loggerConfig.transports) {
      const transportOptions = {};

      if (transport.level) transportOptions.level = transport.level;
      if (transport.filename) transportOptions.filename = transport.filename;

      options.transports.push(
        createTransport(transport.type, transportOptions),
      );
    }
  }

  return winston.createLogger(options);
}

module.exports = { createLogger };
