const program = require('commander');
const { prompt } = require('inquirer');
const { backupAll, restoreAll } = require('./src/logic');
const { fetchDBs } = require('./src/db');
const { backupAllQuestions, restoreAllQuestions } = require('./src/questions');

program
  .version('0.0.1')
  .description('Automate backups and restores of couch databases.')

program
  .command('backupAll')
  .alias('ba')
  .description('Backup entire couch instance')
  .action(() => {
    let creds;
    prompt(backupAllQuestions).then(answers => {
      backupAll(answers.address, answers.backupDestination, answers.dbs);
    });
  });

program
  .command('restoreAll')
  .alias('ra')
  .description('Restore all backups from a destination to a target couch instance')
  .action(() => {
    prompt(restoreAllQuestions).then(answers => {
      restoreAll(answers.address, answers.backupDestination, answers.dbs);
    });
  });

program.parse(process.argv);
