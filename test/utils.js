const assert = require('assert');
const { makeAddress, log } = require('../lib/utils');

describe('util functions', function() {
  describe('#makeAddress()', function() {
    it('should return a correctly formatted and encoded url string', function() {
      let address = makeAddress('foo.bar', 'foo', 'b@r', true);
      assert.equal(address, 'https://foo:b%40r@foo.bar');
    });
  });
  describe('#log()', function() {
    it('should format input and console.log input', function() {
      let input = 'format this';
      assert.equal(log(input), '    *format this');
    });
  });
});
