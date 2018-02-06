const fs = require('fs');
const path = require('path');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const urlencode = require('urlencode');

async function backup(params) {
  let dir = path.join(process.cwd(), params.backupDir);
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
  let dir = path.join(process.cwd(), params.backupDir);
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
  console.log(`        *backing up' ${db.display}`);
  return new Promise((resolve, reject) => {
    couchbackup.backup(db.remote, fs.createWriteStream(db.local), { parallelism: 2 }, (err, data) => {
      if (err) {
        console.log('Failed', db.display, err);
        reject(err);
      } else {
        console.log('Backed', db.local, data);
        resolve(data);
      }
    });
  });
}

function restoreDB(db) {
  console.log(`        *restoring' ${db.local}`);
  return checkDB(db.remote).then(() => new Promise((resolve, reject) => {
    couchbackup.restore(fs.createReadStream(db.local), db.remote, { parallelism: 2 }, (err, data) => {
      if (err) {
        console.log('Failed', db.local, err);
        reject(err);
      } else {
        console.log('Restored', db.display, data);
        resolve(data);
      }
    });
  }));
}

function checkDB(address) {
  return makeFetch(address, { method: 'GET' }).then((res) => {
    if (res.error) {
      console.log(`db ${address} doesn't exist`);
      throw res.error;
    }
    return true;
  }).catch(() => makeFetch(address, { method: 'PUT' }));
}

function checkAuth(address) {
  return makeFetch(address, { method: 'GET' }).then((res) => {
    if (res.error) {
      throw `${res.error}: ${res.reason}`;
    }
    return true;
  });
}

function makeFetch(address, options) {
  return fetch(address, options).then(res => res.json());
}

function makeAddress(url, u, p, https) {
  const protocol = https ? 'https' : 'http';
  return `${protocol}://${u}:${urlencode(p)}@${url}`;
}

module.exports = {
  backup, restore, makeFetch, testConnection, makeAddress,
};
