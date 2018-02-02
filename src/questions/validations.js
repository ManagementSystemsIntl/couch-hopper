const fs = require('fs');
const { testConnection } = require('../logic');

function validateRequired(input, params) {
  return input ? true : "This is required.";
}

function validateConnection(params) {
  var {url, username, password, protocol} = params;
  return new Promise((resolve, reject) => {
    return testConnection(url, username, password, protocol).then(function (res) {
      console.log(`Connected to ${this.url}`);
      this.valid = true;
      this.address = res.address;
      resolve(true);
    }.bind(params)).catch(function (err) {
      console.log(`Unable to connect to ${this.url}`);
      this.valid = false;
      resolve(false);
    }.bind(params));
  });
}

function validateRestoreDirectory(input, params) {
  let dbs = fs.readdirSync(input);
  if (dbs.length > 0) {
    params.dbs = dbs;
    params.valid = true;
    return true;
  } else {
    params.valid = false;
    return "There aren't any files in this location."
  }
}

function validConnection(params) {
  return params.valid;
}

module.exports = { validateRequired, validateConnection, validateRestoreDirectory, validConnection };
