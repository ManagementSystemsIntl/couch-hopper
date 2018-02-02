const urlencode = require('urlencode');
const { checkUrl } = require('./db');

function checkAuth(address) {
  return checkUrl(address).then(res => {
    if (res.error) {
      throw `${res.error}: ${res.reason}`;
    }
    return true;
  });
}

function makeAddress(url, u, p, https) {
  var protocol = https ? "https" : "http";
  return `${protocol}://${u}:${urlencode(p)}@${url}`;
}

module.exports = { checkAuth, makeAddress };
