const { checkArgs, makeAddress, checkAuth } = require('./utils');
const { backup, restore } = require('./db');

async function backupAll(d, u, p, b, i) {
  let address = makeAddress(d, u, p, i);
  try {
    const authorized = await checkAuth(address);
    backup(address, b);
  } catch (err) {
    console.log(err);
  }
}

async function restoreAll(d, u, p, b, i) {
  let address = makeAddress(d, u, p, i);
  try {
    const authorized = await checkAuth(address);
    restore(address, b);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { backupAll, restoreAll };
