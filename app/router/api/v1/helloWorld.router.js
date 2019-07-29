const asyncHandler = require('../../../util/asyncHandler');
const helloWorldController = require('../../../controller/helloWord.controller');


module.exports = (router) => {
  router.get('/', asyncHandler(helloWorldController.helloWorld));
};
