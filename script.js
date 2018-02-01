const fs = require('fs');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const urlencode = require('urlencode');
const args = require('minimist')(process.argv.slice(2));

init();

async function init() {
  if (!args.f) throw new Error("Argument fx must be supplied. Valid values are 'backup' or 'restore'")
  if (args.f === 'backup') {
    let passable = checkArgs(args, ['d', 'u', 'p']);
    if (passable) {
      let address = makeAddress(args.d, args.u, args.p);
      try {
        const authorized = await checkAuth(address);
        backup(address);
      } catch (err) {
        console.log(err);
      }
    }
  } else if (args.f === 'restore') {
    let passable = checkArgs(args, ['d', 'u', 'p']);
    if (passable) {
      let address = makeAddress(args.d, args.u, args.p);
      try {
        const authorized = await checkAuth(address);
        restore(address);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

async function backup(address) {
  const dbs = await fetchDBs(address);
  if (!fs.existsSync("backups")) {
    fs.mkdirSync("backups");
  }
  let chain = dbs.reduce((p,n) => {
    p = p.then(() => harvestDB(address, n));
    return p;
  }, $q.when());
}

async function restore(address) {
  const backups = fs.readdirSync("backups").map(file => {
    return Object.assign({}, {
      local: ["backups",file].join("/"),
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

function checkAuth(address) {
  return fetchDBs(address).then(res => {
    if (res.error) {
      throw `${res.error}: ${res.reason}`;
    }
    return true;
  });
}

function checkDB(address) {
  return fetch(address, {method: "GET"}).then(res => res.json()).then(res => {
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

function harvestDB(address, db) {
  console.log("harvesting", db);
  return new Promise((resolve, reject) => {
    couchbackup.backup([address, db].join("/"), fs.createWriteStream(`backups/${db}.json`), {parallelism: 2}, (err, data) => {
      if (err) {
        console.log("Failed", db, err);
        reject(err);
      } else {
        console.log("backed", db, data);
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
          console.log("restored", db.local, data);
          resolve(data);
        }
      });
    });
  });
}

function checkArgs(argsObj, keys) {
  keys.forEach(key => {
    if (!argsObj[key]) throw new Error(`Missing argument: ${key}`);
  });
  return true;
}

function makeAddress(url, u, p) {
  return `https://${u}:${urlencode(p)}@${url}`;
}
