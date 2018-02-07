const urlencode = require('urlencode');

function log(input) {
  const string = `    *${input}`;
  console.log(string);
  return string;
}

function makeAddress(url, u, p, https) {
  const protocol = https ? 'https' : 'http';
  return `${protocol}://${u}:${urlencode(p)}@${url}`;
}

module.exports = { log, makeAddress };
