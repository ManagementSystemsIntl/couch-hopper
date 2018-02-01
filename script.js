const fs = require('fs');
const $q = require('q');
const fetch = require('node-fetch');
const couchbackup = require('@cloudant/couchbackup');
const urlencode = require('urlencode');
const args = require('minimist')(process.argv.slice(2));
const argsReq = {
  d: "domain",
  u: "username",
  p: "password",
  b: "backup directory",
  f: "function"
};

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

function checkAuth(address) {
  return fetch(address, {method: "GET"}).then(res => res.json()).then(res => {
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

function checkArgs() {
  Object.keys(argsReq).forEach(key => {
    if (!args[key]) throw new Error(`Missing argument '${argsReq[key]}': -${key} [value]`);
  });
  return true;
}

function makeAddress(url, u, p) {
  var protocol = args.i ? "http" : "https";
  return `${protocol}://${u}:${urlencode(p)}@${url}`;
}
