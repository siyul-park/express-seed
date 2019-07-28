const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../app/config/environment');
const convertCamelToPascal = require('../util/convertCamelToPascal');


function createSequelize(databaseConfig) {
  if (databaseConfig.url) {
    return new Sequelize(databaseConfig.url, databaseConfig);
  }
  return new Sequelize(
    `${databaseConfig.dialect}://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`,
    databaseConfig,
  );
}

const sequelize = createSequelize(config.database);

function loadModel(file) {
  return sequelize.import(path.join(__dirname, file));
}

function isJsFile(file) {
  return path.extname(file).toLowerCase() === '.js';
}

function exceptFiles(file) {
  const exceptList = ['index.js', 'config.js', 'utils.js', 'sequelizemodelbuilder.js'];
  for (const item of exceptList) { if (path.basename(file).toLowerCase() === item) return false; }
  return true;
}

function readDir(dir) {
  const files = fs
    .readdirSync(dir)
    .filter(isJsFile)
    .filter(exceptFiles);

  return files;
}

function associateModels(model) {
  if (typeof (model.associate) === 'function') {
    model.associate();
  }
}

const db = {};

const models = readDir(__dirname).map(loadModel);
models.forEach((model) => {
  associateModels(model);
  db[model.name] = model;
});

models.forEach((model) => {
  const modelClassName = convertCamelToPascal(model.name.toString());
  const builderPath = path.join(__dirname, `dataAccessor/${modelClassName}DataAccessorBuilder.js`);
  if (fs.existsSync(builderPath) === true) {
    db[`${model.name}DataAccessor`] = require(builderPath).build(db, model, Sequelize.Op, sequelize.fn);
  } else {
    db[`${model.name}DataAccessor`] = model;
  }
});

db.config = config;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
