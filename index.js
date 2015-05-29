var fs = require('fs');

module.exports = {
    run: function(harJSON, firstPartyUrls) {

        var entries = [];

        entries = getEntries(harJSON);
        thirdPartyProviders = getThirdPartyProviders();

        if (entries.length) {
            entries.forEach(function(entry) {

                if (hasMatchingUrl(firstPartyUrls, entry.request.url)) {
                    addToProvider(firstPartyProvider[0], entry);
                } else {
                    var hasMatch = matchWithProvider(entry);

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
            "firstParty": firstPartyProvider,
            "thirdParty": thirdPartyProviders,
            "unknownParty": unknownProvider
        }
    }
};


// defaults
var thirdPartyProviders = [],
    firstPartyProviders = []

var unknownProvider = [{
    "name": "Unknown Providers",
    "entries": [],
    "totals": {}
}]

var firstPartyProvider = [{
    "name": "First Party providers",
    "entries": [],
    "totals": {}
}];

function calculateTotals(provider) {
    provider.totals.timings = 0;
    provider.totals.requests = 0;
    provider.totals.content = {
        size: 0
    };

    provider.entries.forEach(function(entry) {
        provider.totals.timings = provider.totals.timings + parseInt(entry.time, 10);
        provider.totals.content.size = provider.totals.content.size + parseInt(entry.response.content.size, 10);
    });
    
    provider.totals.requests = provider.entries.length;

}

function getFirstPartyProviders(input) {
    if (typeof input === "undefined") {
        return [];
    } else {
        return input;
    }
}

function getThirdPartyProviders() {
    return JSON.parse(fs.readFileSync(__dirname + '/data/providers.json', 'utf8'));
}

function getEntries(input) {
    var harJSON;

    if (typeof input !== "undefined") {
        var harJSON = input;
    }

    return harJSON.log.entries;
}

function matchWithProvider(entry) {
    var hasMatch = false;

    thirdPartyProviders.forEach(function(provider) {
        // find out if the referer is thirdparty
        for (var header in entry.request.headers) {
            if (entry.request.headers[header].name === 'Referer') {
                if (hasMatchingUrl(provider.matchUrls, entry.request.headers[header].value)) {
                    addToProvider(provider, entry);

                    hasMatch = true;

                    // add this new url as a thirdparty
                    console.log('The referer is a know thirdparty: ' +  provider.name);
                    console.log('new url to add: '+ entry.request.url);
                    provider.matchUrls.push(entry.request.url); 
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

function hasMatchingUrl(matchUrls, url) {
    var hasMatch = false;

    matchUrls.forEach(function(providerUrl) {
        var re = new RegExp(providerUrl, "g");
        var result = url.match(re);

        if (result) {
            hasMatch = true;
        }
    });

    return hasMatch;
}
