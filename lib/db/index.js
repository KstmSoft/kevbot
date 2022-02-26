const fs = require('fs'),
	  logger = require('../services/logger');

module.exports = (db) => {
	let module = {};
	module.get = (key) => {
		try{
			if (fs.existsSync(`${__dirname}/${db}.json`)) {
				const obj = JSON.parse(fs.readFileSync(`${__dirname}/${db}.json`, 'utf8'));
				return Object.keys(obj).length === 0 ? [] : obj[key];
			}
			return [];
		}catch(err){
			logger.error(`(Getting database key) ${err}`);
		}
	};
	module.update = (key, value) => {
		try{
			fs.writeFileSync(`${__dirname}/${db}.json`, JSON.stringify(value));
			return true;
		}catch(err){
			logger.error(`(Updating database key) ${err}`);
		}
	};
	return module;
}