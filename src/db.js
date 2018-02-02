const fs = require('fs');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const { checkAuth, makeAddress } = require('./utils');

async function backup(address, backupDir) {
  const dbs = await fetchDBs(address).then(dbs => {
    return dbs.map(file => {
      return Object.assign({}, {
        local: [backupDir, `${file}.json`].join("/"),
        remote: [address, file].join("/")
      });
    });
  })
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  let chain = dbs.reduce((p,n) => {
    p = p.then(() => harvestDB(n));
    return p;
  }, $q.when());
}

async function restore(address, backupDir) {
  const backups = fs.readdirSync(backupDir).map(file => {
    return Object.assign({}, {
      local: [backupDir, file].join("/"),
      remote: [address, file.replace(".json", "")].join("/")
    });
  });
  let chain = backups.reduce((p,n) => {
    p = p.then(() => restoreDB(n));
    return p;
  }, $q.when());
}

function fetchDBs(address) {
  return fetch([address, "_all_dbs"].join("/"), {method: "GET"}).then(res => res.json());
}

function checkUrl(address) {
  return fetch(address, {method: "GET"}).then(res => res.json());
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

function createDB(address) {
  console.log("creating db", address);
  return fetch(address, {method: "PUT"}).then(res => res.json());
}

function harvestDB(db) {
  console.log("harvesting", db.remote);
  return new Promise((resolve, reject) => {
    couchbackup.backup(db.remote, fs.createWriteStream(db.local), {parallelism: 2}, (err, data) => {
      if (err) {
        console.log("Failed", db.remote, err);
        reject(err);
      } else {
        console.log("backed", db.local, data);
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
          console.log("restored", db.remote, data);
          resolve(data);
        }
      });
    });
  });
}

module.exports = { backup, restore, checkUrl };
