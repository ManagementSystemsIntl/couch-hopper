const connectQuestions = require('./questions/connect');
const backupQuestions = require('./questions/backup');
const restoreQuestions = require('./questions/restore');

const questions = {
  backup: [
    ...connectQuestions,
    ...backupQuestions
  ],
  restore: [
    ...connectQuestions,
    ...restoreQuestions
  ]
};

module.exports = questions;
