const express = require('express');
const setRouter = require('./router');

const app = express();

setRouter(app);

module.exports = app;
