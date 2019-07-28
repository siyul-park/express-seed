require('dotenv').config();

const CONFIG_NAME = 'configName';
const VALUE_NAME = 'valueName';

function getEnvironmentValue(configName, names) {
  let namePath = names[0];

  for (const name of names) namePath += `_${name}`;

  return process.env[`${namePath}_${configName}`] || process.env[`${namePath}`];
}

function concatElementUserEnvironmentValue(configName, path, current) {
  let valueName = '';
  let currentPath = [];
  for (const property in current) {
    if (property === CONFIG_NAME) continue;

    if (property === VALUE_NAME) {
      valueName = current[property].toUpperCase();
      currentPath = path.concat([valueName]);

      continue;
    }

    const propertyName = property.toUpperCase();

    if (typeof current[property] === 'object') {
      concatElementUserEnvironmentValue(configName, currentPath, current[property]);
      continue;
    }

    current[property] = getEnvironmentValue(
      configName, currentPath.concat([propertyName]),
    ) || current[property];
  }
}

function concatUserEnvironmentValue(config) {
  const configName = config[CONFIG_NAME].toUpperCase();

  concatElementUserEnvironmentValue(configName, [], config);
}

const env = process.env.NODE_ENV || 'development';
const config = Object.assign(require('./common'), require(`./${env}`));

concatUserEnvironmentValue(config);

module.exports = config;
