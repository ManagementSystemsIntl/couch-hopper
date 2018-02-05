const validate = require('./validations');
const { makeFetch } = require('../db');

const backupQuestions = [
  {
    type: 'checkbox',
    name: 'dbs',
    when: validate.connection,
    validate: validate.length,
    message(params) {
      return makeFetch([params.address, '_all_dbs'].join('/'), { method: 'GET' }).then((res) => {
        params.allDBs = res;
        console.log(`${params.url} has ${res.length} databases.`);
        return 'Which databases do you want to backup?';
      });
    },
    choices(params) {
      return params.allDBs;
    },
  },
  {
    type: 'input',
    name: 'backupDir',
    when: validate.connected,
    message: 'Where do you want to put these backups?',
    validate: validate.required,
  },
  {
    type: 'confirm',
    name: 'go',
    when: validate.connected,
    message(params) {
      console.log(`You are about to backup ${params.dbs.length} database(s) from ${params.url} to a folder called ${params.backupDir}.`);
      return 'Do you want to proceed?';
    },
  },
];

module.exports = backupQuestions;
