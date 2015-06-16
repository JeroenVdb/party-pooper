'use strict';

var fs = require('fs'),
	url = require('url');

module.exports = {
	'run': function(entryUrl, providerFilePath) {
		var hasMatch = false,
			thirdPartyProviders = getThirdPartyProviders(providerFilePath);

		thirdPartyProviders.forEach(function(provider) {
			if (hasMatchingUrl(provider.matchUrls, entryUrl)) {
				hasMatch = provider;
			}
		});

		return hasMatch;
	}
};

function getThirdPartyProviders(providerFilePath) {
	if (typeof providerFilePath === 'undefined') {
		return JSON.parse(fs.readFileSync(__dirname + '/data/providers.json', 'utf8'));
	} else {
		return JSON.parse(fs.readFileSync(__dirname + providerFilePath, 'utf8'));
	}
}

function hasMatchingUrl(matchUrls, entryUrl) {
	var hasMatch = false;

	matchUrls.forEach(function(urlRegex) {
		var re = new RegExp(urlRegex, 'g'),
			result = entryUrl.match(re);

		if (result) {
			hasMatch = true;
		}
	});

	return hasMatch;
}
