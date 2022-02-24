const fs = require('fs');
module.exports = async (request, client)=>{
	try{
		const command = request.command.toLowerCase(),
			  file = `${command}.js`;
		if(!fs.existsSync(`${__dirname}/${file}`) || file === 'index.js') 
			return {content: 'El comando no existe.', type:'error'};
		return await require(`./${file}`)(request, client);
	}catch(err){
		return err;
	}
}