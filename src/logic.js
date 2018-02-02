const { makeAddress, checkAuth } = require('./utils');
const { backup, restore } = require('./db');

async function testConnection(url, username, password, protocol) {
  let address = makeAddress(url, username, password, protocol);
  try {
    const authorized = await checkAuth(address);
    return {url, username, password, protocol, address};
  } catch (err) {
    throw err;
  }
}

async function backupAll(address, backupDestination, databases) {
  try {
    await backup(address, backupDestination, databases);
  } catch (err) {
    console.log("RIGHT HERE", err);
  }
}

async function restoreAll(address, backupDestination, databases) {
  try {
    await restore(address, backupDestination, databases);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { testConnection, backupAll, restoreAll };
