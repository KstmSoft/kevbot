const fs = require('fs');
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
			console.error(err);
		}
	};
	module.update = (key, value) => {
		try{
			fs.writeFileSync(`${__dirname}/${db}.json`, JSON.stringify(value));
			return true;
		}catch(err){
			console.error(err);
		}
	};
	return module;
}