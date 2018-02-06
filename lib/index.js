const program = require('commander');
const { prompt } = require('inquirer');
const { backup, restore } = require('./db');
const questions = require('./questions');

function init() {
  program
    .version('1.0.5')
    .description('Automate backups and restores of couch databases.');

  program
    .command('backup')
    .alias('b')
    .description('Backup databases from a couchdb instance')
    .action(() => {
      prompt(questions.backup).then((params) => {
        if (params.valid && params.go) {
          backup(params);
        }
      });
    });

  program
    .command('restore')
    .alias('r')
    .description('Restore backups from a destination to a target couchdb instance')
    .action(() => {
      prompt(questions.restore).then((params) => {
        if (params.valid && params.go) {
          restore(params);
        }
      });
    });

  program.parse(process.argv);
}

exports.init = init;
