'use strict';

function provider() {
}

provider.prototype._getAllProviders = function() {
	console.log('this is my function _getAllProviders');
}

module.exports = provider