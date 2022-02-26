const genius = require('genius-lyrics-api'),
	  apiKey = process.env.GENIUS_API_KEY,
	  logger = require('../services/logger');

module.exports = async (request, client)=>{
	return new Promise( async (resolve, reject) => {
		if(!request.args){reject({content: 'Uso /lyrics [song]', type:'error'});return;}
		
		try{
			const options = {
				apiKey: apiKey,
				title: request.args.replace(/\./g,'').toLowerCase(),
				artist: '.',
				optimizeQuery: true
			},
			song = await genius.getSong(options);
			resolve({content: song.albumArt, caption: song.lyrics, type:'image'});
		}catch(err){
			logger.error(`(Getting lyrics) ${err}`);
			reject({content: 'No se pudo obtener las lyrics.', type:'error'});
		}
	});
}