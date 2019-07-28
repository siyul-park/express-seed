const HelloWorldService = require('../service/helloWorld.service');


const helloWorldService = new HelloWorldService();

async function helloWorld(req, res) {
  const response = await helloWorldService.print();

  res.status(200)
    .send(response);
}

module.exports = { helloWorld };
