const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const packageInfo = require('../../../package.json');


const options = {
  swaggerDefinition: {
    info: {
      title: packageInfo.name,
      version: packageInfo.version,
      description: packageInfo.description,
    },
    consumes: [
      'application/json',
    ],
    produces: ['application/json'],
    securityDefinitions: {
      token: {
        type: 'apiKey',
        name: 'Authorization',
        description: 'The credentials to authenticate a user',
        in: 'header',
      },
    },
  },
  apis: [
    path.join(__dirname, '../../controller/**/*.controller.js'),
    path.join(__dirname, '../../controller/**/*.swagger.yaml'),
    path.join(__dirname, './parameters.yaml'),
    path.join(__dirname, './responses.yaml'),
    path.join(__dirname, './definitions.yaml'),
    path.join(__dirname, './tags.yaml'),
  ],
};
const spec = swaggerJSDoc(options);

module.exports = spec;
