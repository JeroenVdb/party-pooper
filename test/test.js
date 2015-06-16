'use strict';

var expect = require('chai').expect,
	partypooper = require('../index.js');

describe('Party Pooper', function(){
	it('Party Pooper should return false when the url isn\'t found', function() {
		var result = partypooper.run('http://www.hln.be', '/test/test-providers.json');
		expect(result).to.be.equal(false);
	});

	it('Party Pooper should return a provider object when the url is found', function() {
		var result = partypooper.run('http://www.jeroenvdb.be', '/test/test-providers.json');
		expect(result).to.be.an('object');
	});
});
