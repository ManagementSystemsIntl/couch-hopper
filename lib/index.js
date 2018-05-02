const program = require('commander');
const { prompt } = require('inquirer');
const { backup, restore, testConnection } = require('./db');
const questions = require('./questions');

function init() {

  program
    .version('1.0.7')
    .description('Interactive backups and restores of couch databases.');

  program
    .command('backup').alias('b')
    .description('Backup databases from a couchdb instance')
    .option('-r, --url <remote>', 'Remote database you want to backup')
    .option('-u, --username <username>', 'Username for remote database')
    .option('-p, --password <password>', 'Password for remote database')
    .option('-s, --https', 'Use https')
    .option('-d, --dbs [databases]', 'Databases to backup (comma-delimited list; leave blank to backup all)', (val) => { return val.split(",") })
    .option('-l, --backupDir <local>', 'Location to save backups')
    .action((cmd) => {
      if (cmd.url && cmd.username && cmd.password && cmd.backupDir) {
        let {url, username, password, backupDir, https, dbs} = cmd;
        let params = {url, username, password, backupDir, https, dbs};
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
        console.log("Missing params...");
      }
    });

  program
    .command('restore').alias('r')
    .description('Restore backups from a destination to a target couchdb instance')
    .option('-r, --url <remote>', 'Remote database you want to restore to')
    .option('-u, --username <username>', 'Username for remote database')
    .option('-p, --password <password>', 'Password for remote database')
    .option('-s, --https', 'Use https')
    .option('-d, --dbs [databases]', 'Backup json files to restore (comma-delimited list, exclude .json file extension; leave blank to restore all)', (val) => { return val.split(",") })
    .option('-l, --backupDir <local>', 'Location of backups')
    .action((cmd) => {
      if (cmd.url && cmd.username && cmd.password && cmd.backupDir) {
        let {url, username, password, backupDir, https, dbs} = cmd;
        let params = {url, username, password, backupDir, https, dbs};
        return testConnection(url, username, password, https).then(res => {
          params.valid = true;
          params.address = res.address;
          if (params.dbs.length === 0) {
            let dir = path.join(process.cwd(), backupDir);
            params.dbs = fs.readdirSync(dir);
          }
          return restore(params);
        });
      } else {
        console.log("Missing params...");
      }
    });

  program
    .command('*', {isDefault: true, noHelp: true})
    .action(() => {
      interactive();
    });

  // if no command is given
  program.parse(process.argv);
  if (program.rawArgs.length <= 2) {
    interactive();
  }
}

function interactive() {
  prompt(questions.operation).then((params) => {
    if (params.operation === "restore") {
      prompt(questions.restore).then((params) => {
        if (params.valid && params.go) {
          return restore(params);
        }
      });
    } else if (params.operation === "backup") {
      prompt(questions.backup).then((params) => {
        if (params.valid && params.go) {
          return backup(params);
        }
      });
    }
  });
}

exports.init = init;
