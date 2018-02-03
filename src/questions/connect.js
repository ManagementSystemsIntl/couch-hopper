const validate = require('./validations');

const connectQuestions = [
  {
    type: 'input',
    name: 'url',
    message: 'Enter destination couch url',
    validate: validate.required
  },
  {
    type: 'input',
    name: 'username',
    message: 'Enter username for that couch instance',
    validate: validate.required
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password for that username',
    validate: validate.required
  },
  {
    type: 'confirm',
    name: 'protocol',
    message: 'Use https protocol? Choose "n" to use http'
  }
];

module.exports = connectQuestions;
