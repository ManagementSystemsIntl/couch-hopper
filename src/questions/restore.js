const { validateConnection, validateRestoreDirectory, validConnection } = require('./validations');

const restoreQuestions = [
  {
    type: 'input',
    name: 'backupDestination',
    when: validateConnection,
    message: "Where are the backups you want to restore?",
    validate: validateRestoreDirectory
  },
  {
    type: 'confirm',
    name: 'go',
    when: validConnection,
    message: function (params) {
      console.log(`You are about to restore ${params.dbs.length} database(s) from ${params.backupDestination} to a couch instance at ${params.url}.`)
      return `Do you want to proceed?`;
    }
  }
];

module.exports = restoreQuestions;
