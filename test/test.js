var expect = require("chai").expect;
var partypooper = require("../index.js");
var fs = require('fs');

describe("Party Pooper", function(){
	it("Party Pooper should output JSON formatted information", function(){
		var result = partypooper.run(JSON.parse(fs.readFileSync(__dirname + '/www.demorgen.be.har', 'utf8')), ['demorgen-cdn.be', 'demorgen.be']);
		
		expect(result).to.have.a.property('firstParty');
		expect(result).to.have.a.property('thirdParty');
		expect(result).to.have.a.property('unknownParty');
	});
});