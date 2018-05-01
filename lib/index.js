const program = require('commander');
const { prompt } = require('inquirer');
const { backup, restore, testConnection } = require('./db');
const questions = require('./questions');

function init() {
  program
    .version('1.0.7')
    .description('Automate backups and restores of couch databases.');

  program
    .command('backup').alias('b')
    .description('Backup databases from a couchdb instance')
    .option('-i, --interactive', 'Create backup interactively')
    .option('-r, --url [remote]', 'Remote database you want to backup')
    .option('-u, --username [username]', 'Username for remote database')
    .option('-p, --password [password]', 'Password for remote database')
    .option('-h, --https', 'Use https')
    .option('-d, --dbs [databases]', 'Databases to backup (comma-delimited list; leave blank to backup all)', (val) => { return val.split(",") })
    .option('-l, --backupDir [local]', 'Location to save backups')
    .action((cmd) => {
      if (cmd.url && cmd.username && cmd.password && cmd.backupDir && !cmd.interactive) {
        let {url, username, password, backupDir, https, dbs, all} = cmd;
        let params = {url, username, password, backupDir, https, dbs, all};
        return testConnection(url, username, password, https).then(res => {
          params.valid = true;
          params.address = res.address;
          if (params.dbs.length === 0) {
            return makeFetch([params.address, '_all_dbs'].join('/'), { method: 'GET' }).then((res) => {
              params.dbs = res;
              return backup(params);
            });
          } else {
            return backup(params);
          }
        });
      } else {
        return prompt(questions.backup).then((params) => {
          if (params.valid && params.go) {
            return backup(params);
          }
        });
      }
    });

  program
    .command('restore').alias('r')
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
