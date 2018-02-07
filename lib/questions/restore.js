const validate = require('./validations');
const { log } = require('../utils');

const restoreQuestions = [
  {
    type: 'input',
    name: 'backupDir',
    when: validate.connection,
    message: 'Where are the backups you want to restore?',
    validate: validate.directory,
  },
  {
    type: 'checkbox',
    name: 'dbs',
    when: validate.connected,
    validate: validate.length,
    message(params) {
      log(`${params.backupDir} has ${params.allDBs.length} databases.`);
      return 'Which databases do you want to backup?';
    },
    choices(params) {
      return params.allDBs.map(file => file.replace('.json', ''));
    },
  },
  {
    type: 'confirm',
    name: 'go',
    when: validate.connected,
    message(params) {
      log(`You are about to restore ${params.dbs.length} database(s) from ${params.backupDir} to a couch instance at ${params.url}.`);
      return 'Do you want to proceed?';
    },
  },
];

module.exports = restoreQuestions;
