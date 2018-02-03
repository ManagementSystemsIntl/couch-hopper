const fs = require('fs');
const { testConnection } = require('../db');

const validations = {
  required: function (input, params) {
    return input ? true : "This is required.";
  },
  length: function (input) {
    return input.length >= 1 || 'You must choose at least one database';
  },
  connection: function (params) {
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
  },
  directory: function (input, params) {
    let dbs = fs.readdirSync(input);
    if (dbs.length > 0) {
      params.allDBs = dbs;
      params.valid = true;
      return true;
    } else {
      params.valid = false;
      return "There aren't any files in this location."
    }
  },
  connected: function (params) {
    return params.valid;
  }
};

module.exports = validations;
