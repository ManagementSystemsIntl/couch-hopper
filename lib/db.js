const fs = require('fs');
const path = require('path');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const { log, makeAddress } = require('./utils');

async function backup(params) {
  const dir = path.join(process.cwd(), params.backupDir);
  const dbs = params.dbs.map(file => Object.assign({}, {
    local: [dir, `${file}.json`].join('/'),
    remote: [params.address, file].join('/'),
    display: [params.url, file].join('/'),
  }));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dbs.reduce((p, n) => {
    p = p.then(() => backupDB(n));
    return p;
  }, $q.when());
}

async function restore(params) {
  const dir = path.join(process.cwd(), params.backupDir);
  const backups = params.dbs.map(file => Object.assign({}, {
    local: [dir, `${file}.json`].join('/'),
    remote: [params.address, file].join('/'),
    display: [params.url, file].join('/'),
  }));
  return backups.reduce((p, n) => {
    p = p.then(() => restoreDB(n));
    return p;
  }, $q.when());
}

async function testConnection(url, username, password, https) {
  const address = makeAddress(url, username, password, https);
  try {
    const authorized = await checkAuth(address);
    return {
      authorized, url, username, password, https, address,
    };
  } catch (err) {
    throw err;
  }
}

function backupDB(db) {
  log(`Backing up ${db.display}...`);
  return new Promise((resolve, reject) => {
    couchbackup.backup(db.remote, fs.createWriteStream(db.local), { parallelism: 2 }, (err, data) => {
      if (err) {
        log(`*Failed to backup ${db.display}: ${err}`);
        reject(err);
      } else {
        log(`*Successfully backed up ${db.display}`);
        resolve(data);
      }
    });
  });
}

function restoreDB(db) {
  log(`Restoring ${db.local}...`);
  return checkDB(db.remote).then(() => new Promise((resolve, reject) => {
    couchbackup.restore(fs.createReadStream(db.local), db.remote, { parallelism: 2 }, (err, data) => {
      if (err) {
        log(`*Failed to restore ${db.display}: ${err}`);
        reject(err);
      } else {
        log(`*Successfully restored ${db.display}`);
        resolve(data);
      }
    });
  }));
}

function checkDB(address) {
  return makeFetch(address, { method: 'GET' }).then((res) => {
    if (res.error) {
      log(`db ${address} doesn't exist`);
      throw res.error;
    }
    return true;
  }).catch(() => makeFetch(address, { method: 'PUT' }));
}

function checkAuth(address) {
  return makeFetch(address, { method: 'GET' }).then((res) => {
    if (res.error) {
      throw res;
    }
    return true;
  });
}

function makeFetch(address, options) {
  return fetch(address, options).then(res => res.json());
}

module.exports = {
  backup, restore, makeFetch, testConnection,
};
