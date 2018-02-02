const { testConnection } = require('./logic');
const { fetchDBs } = require('./db');
const fs = require('fs');

const connectQuestions = [
  {
    type: 'input',
    name: 'url',
    message: 'Enter destination couch url'
  },
  {
    type: 'input',
    name: 'username',
    message: 'Enter username for that couch instance'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password for that username'
  },
  {
    type: 'confirm',
    name: 'protocol',
    message: 'Use https protocol? Choose "n" to use http'
  },
];

const backupAllQuestions = [
  ...connectQuestions,
  {
    type: 'input',
    name: 'backupDestination',
    message: function (params) {
      var {url, username, password, protocol} = params;
      return testConnection(url, username, password, protocol).then(res => {
        params.address = res.address;
        console.log(`Connected to ${params.url}`);
        return fetchDBs(params.address);
      }).then(res => {
        params.dbs = res;
        console.log(`${params.url} has ${res.length} databases.`);
        return "Where do you want to put these backups?";
      });
    }
  },
  {
    type: 'confirm',
    name: 'go',
    message: function (params) {
      console.log(`You are about to backup ${params.dbs.length} database(s) from ${params.url} to a folder called ${params.backupDestination}.`)
      return `Do you want to proceed?`;
    }
  }
];

const restoreAllQuestions = [
  ...connectQuestions,
  {
    type: 'input',
    name: 'backupDestination',
    message: function (params) {
      var {url, username, password, protocol} = params;
      return testConnection(url, username, password, protocol).then(res => {
        params.address = res.address;
        console.log(`Connected to ${params.url}`);
        return "Where are the backups you want to restore?";
      });
    }
  },
  {
    type: 'confirm',
    name: 'go',
    message: function (params) {
      params.dbs = fs.readdirSync(params.backupDestination);
      console.log(`You are about to restore ${params.dbs.length} database(s) from ${params.backupDestination} to a couch instance at ${params.url}.`)
      return `Do you want to proceed?`;
    }
  }
];

module.exports = { backupAllQuestions, restoreAllQuestions };
