const connectQuestions = require('./questions/connect');
const backupQuestions = require('./questions/backup');
const restoreQuestions = require('./questions/restore');

const questions = {
  operation: {
    type: 'list',
    name: 'operation',
    message: 'What are we doing here today?',
    choices: ['backup', 'restore']
  },
  backup: [
    ...connectQuestions,
    ...backupQuestions,
  ],
  restore: [
    ...connectQuestions,
    ...restoreQuestions,
  ],
};

module.exports = questions;
