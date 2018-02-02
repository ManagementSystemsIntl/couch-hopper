const { validateRequired } = require('./validations');

const connectQuestions = [
  {
    type: 'input',
    name: 'url',
    message: 'Enter destination couch url',
    validate: validateRequired
  },
  {
    type: 'input',
    name: 'username',
    message: 'Enter username for that couch instance',
    validate: validateRequired
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password for that username',
    validate: validateRequired
  },
  {
    type: 'confirm',
    name: 'protocol',
    message: 'Use https protocol? Choose "n" to use http'
  }
];

module.exports = connectQuestions;
