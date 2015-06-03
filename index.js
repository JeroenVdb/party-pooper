'use strict';

var fs = require('fs'),
	url = require('url'),
	pretty = require('prettysize');

module.exports = {
	'run': function(harJSON, firstPartyUrls) {
		var entries = [],
			hasMatch,
			firstPartyProvider = [],
			thirdPartyProviders = [],
			unknownProvider = [];

		unknownProvider = [{
			'name': 'Unknown Providers',
			'entries': [],
			'totals': {}
		}];

		firstPartyProvider = [{
			'name': 'First Party providers',
			'entries': [],
			'totals': {}
		}];

		entries = getEntries(harJSON);
		thirdPartyProviders = getThirdPartyProviders();

		if (entries.length) {
			entries.forEach(function(entry) {
				if (hasMatchingUrl(firstPartyUrls, entry.request.url)) {
					addToProvider(firstPartyProvider[0], entry);
				} else {
					hasMatch = matchWithProvider(thirdPartyProviders, entry);

					if (!hasMatch) {
						addToProvider(unknownProvider[0], entry);
					}
				}
			});
		}

		thirdPartyProviders.forEach(function(provider) {
			calculateTotals(provider);
		});

		firstPartyProvider.forEach(function(provider) {
			calculateTotals(provider);
		});

		unknownProvider.forEach(function(provider) {
			calculateTotals(provider);
		});

		return {
			'firstParty': firstPartyProvider,
			'thirdParty': thirdPartyProviders,
			'unknownParty': unknownProvider
		};
	}
};

function calculateTotals(provider) {
	provider.totals.timings = 0;
	provider.totals.requests = 0;
	provider.totals.content = {
		'size': 0
	};

	provider.entries.forEach(function(entry) {
		provider.totals.timings += parseInt(entry.time, 10);
		provider.totals.content.size += parseInt(entry.response.content.size, 10);
	});

	provider.totals.content.size = pretty(provider.totals.content.size);

	provider.totals.requests = provider.entries.length;
}

function getThirdPartyProviders() {
	return JSON.parse(fs.readFileSync(__dirname + '/data/providers.json', 'utf8'));
}

function getEntries(input) {
	var harJSON;

	if (typeof input !== 'undefined') {
		harJSON = input;
	}

	return harJSON.log.entries;
}

function matchWithProvider(thirdPartyProviders, entry) {
	var hasMatch = false,
		header;

	thirdPartyProviders.forEach(function(provider) {
		// find out if the referer is thirdparty
		for (header in entry.request.headers) {
			if (entry.request.headers[header].name === 'Referer') {
				if (hasMatchingUrl(provider.matchUrls, entry.request.headers[header].value)) {
					addToProvider(provider, entry);

					hasMatch = true;

					// add this new url as a thirdparty
					provider.matchUrls.push(url.parse(entry.request.url).hostname);
				}
			}
		}

		if (!hasMatch && hasMatchingUrl(provider.matchUrls, entry.request.url)) {
			addToProvider(provider, entry);

			hasMatch = true;
		}
	});

	return hasMatch;
}

function addToProvider(provider, entry) {
	provider.entries.push(entry);
}

function hasMatchingUrl(matchUrls, entryUrl) {
	var hasMatch = false,
		entryUrlHostname = url.parse(entryUrl).hostname;

	matchUrls.forEach(function(providerUrl) {
		var re = new RegExp(providerUrl, 'g'),
			result = entryUrlHostname.match(re);

		if (result) {
			hasMatch = true;
		}
	});

	return hasMatch;
}
