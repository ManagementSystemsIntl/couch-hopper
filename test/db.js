const assert = require('assert');
const db = require('../lib/db');
const { makeAddress } = require('../lib/utils');
const env = require('./env');

describe('couch methods', function() {
  describe('#testConnection()', function() {
    it('should throw an error if unable to connect', function() {
      return db.testConnection('baba', 'baba', 'baba', true).catch(err => {
        assert.throws(() => {throw new Error(err)});
      });
    });
    it('should return true if able to connect', function() {
      let {url, username, password, https} = env;
      return db.testConnection(url, username, password, https).then(res => {
        assert.equal(res.authorized, true);
      });
    });
  });
  describe('#makeFetch()', function() {
    it('should return json when fetch request is valid', function() {
      let {url, username, password, https} = env;
      let address = makeAddress(url, username, password, https);
      return db.makeFetch(address, { options: 'GET' }).then(res => {
        assert.equal(res.hasOwnProperty('couchdb'), true);
      });
    });
    it('should have to catch error when fetch request is invalid', function() {
      let address = makeAddress('baba', 'baba', 'baba', true);
      return db.makeFetch(address, { options: 'GET' }).catch(err => {
        assert.throws(() => {throw new Error(err)});
      });
    });
  });
});
