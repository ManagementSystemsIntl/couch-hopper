const args = require('minimist')(process.argv.slice(2));
const { checkArgs, makeAddress, checkAuth } = require('./src/utils');
const { backup, restore } = require('./src/db');

init();

async function init() {
  if (!args.f) throw new Error("Argument fx must be supplied. Valid values are 'backup' or 'restore'");
  if (args.f === 'backup') {
    let passable = checkArgs();
    if (passable) {
      let address = makeAddress(args.d, args.u, args.p);
      try {
        const authorized = await checkAuth(address);
        backup(address, args.b);
      } catch (err) {
        console.log(err);
      }
    }
  } else if (args.f === 'restore') {
    let passable = checkArgs();
    if (passable) {
      let address = makeAddress(args.d, args.u, args.p);
      try {
        const authorized = await checkAuth(address);
        restore(address, args.b);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
