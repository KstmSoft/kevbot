const fs = require('fs');

module.exports = (key) => {
	const configObj = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
	return configObj[key];
}