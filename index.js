const program = require('commander');
const { prompt } = require('inquirer');
const { backup, restore } = require('./src/db');
const questions = require('./src/questions');

program
  .version('0.0.1')
  .description('Automate backups and restores of couch databases.')

program
  .command('backup')
  .alias('b')
  .description('Backup entire couch instance')
  .action(() => {
    prompt(questions.backup).then(params => {
      if (params.valid) {
        backup(params.address, params.backupDestination, params.dbs);
      }
    });
  });

program
  .command('restore')
  .alias('r')
  .description('Restore all backups from a destination to a target couch instance')
  .action(() => {
    prompt(questions.restore).then(params => {
      if (params.valid) {
        restore(params.address, params.backupDestination, params.dbs);
      }
    });
  });

program.parse(process.argv);
