const validate = require('./validations');

const restoreQuestions = [
  {
    type: 'input',
    name: 'backupDestination',
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
      console.log(`${params.backupDestination} has ${params.allDBs.length} databases.`);
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
      console.log(`You are about to restore ${params.dbs.length} database(s) from ${params.backupDestination} to a couch instance at ${params.url}.`);
      return 'Do you want to proceed?';
    },
  },
];

module.exports = restoreQuestions;
