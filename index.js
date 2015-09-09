'use strict';

var fs = require('fs'),
	url = require('url'),
	calmcard = require('calmcard');

module.exports = {
	'run': function(entryUrl) {
		var hasMatch = false,
			thirdPartyProviders = getThirdPartyProviders(),
			returnProvider = {
				'id': '',
				'name': '',
				'matchUrls': [],
				'category': 'Unknown'
			},
			urlObject;

		thirdPartyProviders.forEach(function(provider) {
			if (hasMatchingUrl(provider.matchUrls, entryUrl)) {
				returnProvider = provider;
				hasMatch = true;
			}
		});

		// make a new provider from the entryUrl(host)
		if (hasMatch === false) {
			urlObject = url.parse(entryUrl);

			returnProvider.id = urlObject.host;
			returnProvider.name = urlObject.host;
			returnProvider.matchUrls.push(urlObject.host);
		}

		return returnProvider;
	}
};

function getThirdPartyProviders() {
	return JSON.parse(fs.readFileSync(__dirname + '/data/providers.json', 'utf8'));
}

function hasMatchingUrl(matchUrls, entryUrl) {
	var hasMatch = false;

	matchUrls.forEach(function(matchUrl) {
		if (calmcard(matchUrl, entryUrl)) {
			hasMatch = true;
		}
	});

	return hasMatch;
}
