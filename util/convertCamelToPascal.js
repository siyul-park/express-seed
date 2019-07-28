function convertCamelToPascal(camelString) {
  return camelString.charAt(0).toLowerCase() + camelString.slice(1);
}

module.exports = convertCamelToPascal;
