const fs = require('fs'),
	_ = require('underscore'),
	logger = require('../services/logger');

module.exports = (request, client)=>{
	return new Promise((resolve, reject) => {
		fs.readdir(__dirname, (err, files) => {
			if(err){
				logger.error(`(Listing dir in help) ${err}`);
				reject({content:'Ha ocurrido un error', type: 'error'});
				return;
			}
			const availableCommands = _.map(_.without(files, 'index.js', 'authorize.js'), (file)=>{
										return `/${file.slice(0,-3)}`;
									  }).join('\n');
			resolve({title:'Comandos disponibles', content:availableCommands, type:'text'});
		});
	});
}