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
    prompt(backupAllQuestions).then(answers => {
      var {source, username, password, backupDestination, protocol} = answers;
      backupAll(source, username, password, backupDestination, protocol);
    })
  });

program
  .command('restoreAll')
  .alias('ra')
  .description('Restore all backups from a destination to a target couch instance')
  .action(() => {
    prompt(restoreAllQuestions).then(answers => {
      var {target, username, password, backupDestination, protocol} = answers;
      restoreAll(target, username, password, backupDestination, protocol);
    })
  });

program.parse(process.argv);
