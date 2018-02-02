const urlencode = require('urlencode');
const args = require('minimist')(process.argv.slice(2));
const { checkUrl } = require('./db');
const argsReq = {
  d: "domain",
  u: "username",
  p: "password",
  b: "backup directory",
  f: "function"
};

function checkAuth(address) {
  return checkUrl(address).then(res => {
    if (res.error) {
      throw `${res.error}: ${res.reason}`;
    }
    return true;
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

module.exports = { checkAuth, checkArgs, makeAddress };
