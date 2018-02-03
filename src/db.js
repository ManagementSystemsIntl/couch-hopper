const fs = require('fs');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const urlencode = require('urlencode');

async function backup(address, backupDir, databases) {
  const dbs = databases.map(file => {
    return Object.assign({}, {
      local: [backupDir, `${file}.json`].join("/"),
      remote: [address, file].join("/")
    });
  });
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  let chain = dbs.reduce((p,n) => {
    p = p.then(() => harvestDB(n));
    return p;
  }, $q.when());
}

async function restore(address, backupDir, databases) {
  const backups = databases.map(file => {
    return Object.assign({}, {
      local: [backupDir, `${file}.json`].join("/"),
      remote: [address, file].join("/")
    });
  });
  let chain = backups.reduce((p,n) => {
    p = p.then(() => restoreDB(n));
    return p;
  }, $q.when());
}

async function testConnection(url, username, password, protocol) {
  let address = makeAddress(url, username, password, protocol);
  try {
    const authorized = await checkAuth(address);
    return {url, username, password, protocol, address};
  } catch (err) {
    throw err;
  }
}

function harvestDB(db) {
  console.log("harvesting", db.remote);
  return new Promise((resolve, reject) => {
    couchbackup.backup(db.remote, fs.createWriteStream(db.local), {parallelism: 2}, (err, data) => {
      if (err) {
        console.log("Failed", db.remote, err);
        reject(err);
      } else {
        console.log("Backed", db.local, data);
        resolve(data);
      }
    });
  });
}

function restoreDB(db) {
  console.log("restoring", db.local);
  return checkDB(db.remote).then(() => {
    return new Promise((resolve, reject) => {
      couchbackup.restore(fs.createReadStream(db.local), db.remote, {parallelism: 2}, (err, data) => {
        if (err) {
          console.log("Failed", db.local, err);
          reject(err);
        } else {
          console.log("Restored", db.remote, data);
          resolve(data);
        }
      });
    });
  });
}

function checkDB(address) {
  return checkUrl(address).then(res => {
    if (res.error) {
      console.log(`db ${address} doesn't exist`);
      throw res.error;
    }
    return true;
  }).catch(res => createDB(address));
}

function checkAuth(address) {
  return checkUrl(address).then(res => {
    if (res.error) {
      throw `${res.error}: ${res.reason}`;
    }
    return true;
  });
}

function createDB(address) {
  console.log("creating db", address);
  return fetch(address, {method: "PUT"}).then(res => res.json());
}

function fetchDBs(address) {
  return fetch([address, "_all_dbs"].join("/"), {method: "GET"}).then(res => res.json());
}

function checkUrl(address) {
  return fetch(address, {method: "GET"}).then(res => res.json());
}

function makeAddress(url, u, p, https) {
  var protocol = https ? "https" : "http";
  return `${protocol}://${u}:${urlencode(p)}@${url}`;
}

module.exports = { backup, restore, fetchDBs, testConnection };
