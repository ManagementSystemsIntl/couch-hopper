const fs = require('fs');
const path = require('path');
const { testConnection } = require('../db');

const validations = {
  required(input) {
    return input ? true : 'This is required.';
  },
  length(input) {
    return input.length >= 1 || 'You must choose at least one database';
  },
  connection(params) {
    const {
      url, username, password, https,
    } = params;
    return new Promise(resolve => testConnection(url, username, password, https).then(function (res) {
      console.log(`Connected to ${this.url}`);
      this.valid = true;
      this.address = res.address;
      resolve(true);
    }.bind(params)).catch(function () {
      console.log(`Unable to connect to ${this.url}`);
      this.valid = false;
      resolve(false);
    }.bind(params)));
  },
  directory(input, params) {
    try {
      let dir = path.join(process.cwd(), input);
      let dbs = fs.readdirSync(dir);
      if (dbs.length > 0) {
        params.allDBs = dbs;
        params.valid = true;
        return true;
      }
      params.valid = false;
      return 'There aren\'t any files in this location.';
    } catch (err) {
      return 'This directory doesn\'t exist.';
    }
  },
  connected(params) {
    return params.valid;
  },
};

module.exports = validations;
