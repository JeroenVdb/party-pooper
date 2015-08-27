# Party Pooper

Get meta data about (thirdparty) requests. We return a name and category if a thirdparty provider match is found.

```javascript
var partyPooper = require('party-pooper');

partyPooper.run('http://connect.facebook.net/en_US/fbds.js');

/*
Returns
{
	"id": "facebook",
	"name": "Facebook",
	"matchUrls": ["^(https|http|):\/\/(.+)\\.facebook\\.(com|net)", "^(https|http|)(:\/\/|)(www.|)fbstatic-a.akamaihd.net"],
	"category": "Social"
}
*/

partyPooper.run('http://unknown-provider.net/somethingSomething.js');

/*
Returns
{
	"id": "unknown-provider.net",
	"name": "unknown-provider.net",
	"matchUrls": ["unknown-provider.net"],
	"category": "Unknown"
}
*/
```
