const HelloWorldService = require('../service/helloWorld.service');

const helloWorldService = new HelloWorldService();

function helloWorld(req, res) {
  const response = helloWorldService.print();

  res.send(response);
}

module.exports = { helloWorld };
