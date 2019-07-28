const request = require('../agent');

describe('App', () => {
  it('has the default page', (done) => {
    request
      .get('/')
      .expect(/Hello World!/, done);
  });
});
