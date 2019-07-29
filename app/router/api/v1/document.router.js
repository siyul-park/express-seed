const swaggerUi = require('swagger-ui-express');
const spec = require('../../../config/swagger');

module.exports = (router) => {
  router.use('/doc', swaggerUi.serve, swaggerUi.setup(spec));
};
