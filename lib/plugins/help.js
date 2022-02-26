const fs = require('fs'),
	   _ = require('underscore');

module.exports = (request, client)=>{
	return new Promise((resolve, reject) => {
		fs.readdir(__dirname, (err, files) => {
			if(err) reject({content:'Ha ocurrido un error', type: 'error'})
			const availableCommands = _.map(_.without(files, 'index.js', 'authorize.js'), (file)=>{
										return `/${file.slice(0,-3)}`;
									  }).join('\n');
			resolve({title:'Comandos disponibles', content:availableCommands, type:'text'});
		});
	});
}