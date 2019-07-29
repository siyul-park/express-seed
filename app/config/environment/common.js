const packageInfo = require('../../../package.json');

module.exports = {
  host: 'localhost',
  port: 7070,

  logger: {
    name: packageInfo.name,
    streams: [{
      type: 'stream',
      stream: process.stdout,
      level: 'debug',
    }],
  },

  database: {
    valueName: 'db',

    url: null,
  },
};
