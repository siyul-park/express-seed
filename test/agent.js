const supertest = require('supertest');
const app = require('../app');

module.exports = supertest(app);
