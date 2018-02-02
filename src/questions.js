const connectQuestions = require('./questions/connect');
const backupQuestions = require('./questions/backup');
const restoreQuestions = require('./questions/restore');

const backupAllQuestions = [
  ...connectQuestions,
  ...backupQuestions
];

const restoreAllQuestions = [
  ...connectQuestions,
  ...restoreQuestions
];

module.exports = { backupAllQuestions, restoreAllQuestions };
