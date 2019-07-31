const packageInfo = require('../../../package.json');

module.exports = {
  host: 'localhost',
  port: 7070,
  numberOfContainers: 2,

  logger: {
    name: packageInfo.name,
    transports: [{
      type: 'console',
      level: 'debug',
    }, {
      type: 'file',
      filename: 'log/server.log',
      level: 'error',
    }],
  },

  database: {
    valueName: 'db',

    url: null,
  },
};
