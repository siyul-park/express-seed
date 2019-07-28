const helloWorldController = require('../controller/helloWord.controller');

module.exports = (app) => {
  app.get('/', helloWorldController.helloWorld);
};
