const backupAllQuestions = [
  {
    type: 'input',
    name: 'source',
    message: 'Enter source couch url'
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
    type: 'input',
    name: 'backupDestination',
    message: 'Where would you like the backup to go?'
  },
  {
    type: 'confirm',
    name: 'protocol',
    message: 'Use https protocol? Choose "n" to use http'
  }
];

const restoreAllQuestions = [
  {
    type: 'input',
    name: 'target',
    message: 'Enter target couch url'
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
    type: 'input',
    name: 'backupDestination',
    message: 'Where are the backups you want to restore?'
  },
  {
    type: 'confirm',
    name: 'protocol',
    message: 'Use https protocol? Choose "n" to use http'
  }
];

module.exports = { backupAllQuestions, restoreAllQuestions };
