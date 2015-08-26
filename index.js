'use strict';

var fs = require('fs'),
	url = require('url');

module.exports = {
	'run': function(entryUrl, providerFilePath) {
		var hasMatch = false,
			thirdPartyProviders = getThirdPartyProviders(providerFilePath),
			returnProvider = {
				'id': '',
				'name': '',
				'matchUrls': [],
				'category': 'Unknown',
				'entries': [],
				'totals': {}
			},
			urlObject;

		thirdPartyProviders.forEach(function(provider) {
			if (hasMatchingUrl(provider.matchUrls, entryUrl)) {
				console.log('We did find a match! Good!');
				returnProvider = provider;
				hasMatch = true;
			}
		});

		// make a new provider from the entryUrl(host)
		if (hasMatch === false) {
			urlObject = url.parse(entryUrl);

			console.log('We didn\'t find a match, lets make this request a new provider: ' + entryUrl);

			returnProvider.id = urlObject.host;
			returnProvider.name = urlObject.host;
			returnProvider.matchUrls.push(urlObject.host);
		}

		return returnProvider;
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
