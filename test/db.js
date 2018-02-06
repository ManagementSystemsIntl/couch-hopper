const assert = require('assert');
const nock = require('nock');
const db = require('../lib/db');
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
      let address = db.makeAddress(url, username, password, https);
      return db.makeFetch(address, { options: 'GET' }).then(res => {
        assert.equal(res.hasOwnProperty('couchdb'), true);
      });
    });
    it('should have to catch error when fetch request is invalid', function() {
      let address = db.makeAddress('baba', 'baba', 'baba', true);
      return db.makeFetch(address, { options: 'GET' }).catch(err => {
        assert.throws(() => {throw new Error(err)});
      });
    });
  });
  describe('#makeAddress()', function() {
    it('should return a correctly formatted and encoded url string', function() {
      let address = db.makeAddress('foo.bar', 'foo', 'b@r', true);
      assert.equal(address, 'https://foo:b%40r@foo.bar');
    });
  });
  // describe('backup', function() {
  //   it('should backup specified databases from a given remote', function() {
  //     let {url, username, password, https} = env;
  //     let address = db.makeAddress(url, username, password, https);
  //     var nocker = nock(address)
  //   });
  // });
});
