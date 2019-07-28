const asyncHandler = require('../util/asyncHandler');
const helloWorldController = require('../controller/helloWord.controller');


module.exports = (app) => {
  app.get('/', asyncHandler(helloWorldController.helloWorld));
};
