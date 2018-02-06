const assert = require('assert');
const validate = require('../lib/questions/validations');
const env = require('./env');

describe('validations', function() {
  describe('#required()', function() {
    it('should return an error if no input', function() {
      assert.equal(validate.required(), 'This is required.');
    });
    it('should return true if input', function() {
      assert.equal(validate.required("something"), true);
    });
  });
  describe('#length()', function() {
    it('should return an error if length === 0', function() {
      assert.equal(validate.length([]), 'You must choose at least one database');
    });
    it('should return true if length >= 1', function() {
      assert.equal(validate.length(['db']), true);
    });
  });
  describe('#connection()', function() {
    it('should return false if unable to connect', function() {
      return validate.connection({ url: 'baba', username: 'baba', password: 'baba', https: true }).then(res => {
        assert.equal(res, false);
      });
    });
    it('should return true if able to connect', function() {
      return validate.connection(env).then(res => {
        assert.equal(res, true);
      });
    });
  });
  describe('#directory()', function() {
    it('should return an error if no files in directory', function() {
      assert.equal(validate.directory('banana', {}), 'This directory doesn\'t exist.');
    });
    it('should return true if directory has files', function() {
      assert.equal(validate.directory('./lib', {}), true);
    });
  });
  describe('#connected()', function() {
    it('should return false if connection is invalid', function() {
      assert.equal(validate.connected({valid: false}), false);
    });
    it('should return true if connection is valid', function() {
      assert.equal(validate.connected({valid: true}), true);
    });
  });
});
