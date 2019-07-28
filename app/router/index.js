const _ = require('lodash');
const fs = require('fs');
const path = require('path');


function isJsFile(file) {
  return path.extname(file).toLowerCase() === '.js';
}

function isDir(dirname, file) {
  const stat = fs.statSync(path.join(dirname, file));

  return stat.isDirectory();
}

function exceptFiles(file) {
  const exceptList = ['index.js', 'config.js', 'util.js'];

  for (const item of exceptList) {
    if (path.basename(file).toLowerCase() === item) return false;
  }
  return true;
}

function readFile(dir) {
  return fs
    .readdirSync(dir)
    .filter(isJsFile)
    .filter(exceptFiles);
}

function readDir(dir) {
  return fs
    .readdirSync(dir)
    .filter(
      _.curry(isDir)(dir),
    );
}

function linkRouter(dirname, app) {
  return file => require(path.join(dirname, file))(app);
}

function setRouter(app, dirname = __dirname) {
  readFile(dirname).forEach(linkRouter(dirname, app));
  readDir(dirname).forEach(linkRouter(dirname, app));
}

module.exports = setRouter;
