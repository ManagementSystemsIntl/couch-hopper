const { validateConnection, validConnection } = require('./validations');
const { fetchDBs } = require('../db');

const backupQuestions = [
  {
    type: 'input',
    name: 'backupDestination',
    when: validateConnection,
    message: function (params) {
      return fetchDBs(params.address).then(res => {
        params.dbs = res;
        console.log(`${params.url} has ${res.length} databases.`);
        return "Where do you want to put these backups?";
      });
    }
  },
  {
    type: 'confirm',
    name: 'go',
    when: validConnection,
    message: function (params) {
      console.log(`You are about to backup ${params.dbs.length} database(s) from ${params.url} to a folder called ${params.backupDestination}.`)
      return `Do you want to proceed?`;
    }
  }
];

module.exports = backupQuestions;
