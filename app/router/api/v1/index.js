const express = require('express');
const setRouter = require('../../index');


const router = express.Router();

module.exports = (app) => {
  setRouter(router, __dirname);

  app.use('/v1', router);
};
