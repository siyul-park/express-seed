const helloWorldController = require('../../controller/helloWord.controller');

module.exports = (app) => {
  app.get('/v1', helloWorldController.helloWorld);
};
