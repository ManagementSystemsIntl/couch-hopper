const program = require('commander');
const { prompt } = require('inquirer');
const { backupAll, restoreAll } = require('./src/logic');
const { backupAllQuestions, restoreAllQuestions } = require('./src/questions');

program
  .version('0.0.1')
  .description('Automate backups and restores of couch databases.')

program
  .command('backupAll')
  .alias('ba')
  .description('Backup entire couch instance')
  .action(() => {
    prompt(backupAllQuestions).then(params => {
      if (params.valid) {
        backupAll(params.address, params.backupDestination, params.dbs);
      }
    });
  });

program
  .command('restoreAll')
  .alias('ra')
  .description('Restore all backups from a destination to a target couch instance')
  .action(() => {
    prompt(restoreAllQuestions).then(params => {
      if (params.valid) {
        restoreAll(params.address, params.backupDestination, params.dbs);
      }
    });
  });

program.parse(process.argv);
