module.exports = (app) => {
  app.get('/v1', (req, res) => {
    res.send('Hello World!');
  });
};
