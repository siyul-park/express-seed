module.exports = {
  host: 'localhost',
  port: 7070,

  logger: {
    name: 'course-design-backend-dev',
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
