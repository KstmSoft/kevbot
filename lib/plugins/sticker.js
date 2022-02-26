const logger = require('../services/logger');

module.exports = async (request, client)=>{
	return new Promise( async (resolve, reject) => {
		try{
			//If message is quoted, process quoted message object
			request.extras = request.extras.quotedMsg ? request.extras.quotedMsg : request.extras;

			const type = request.extras.type;
			if(type != 'image' && type != 'video') {reject({content: 'Necesitas adjuntar una imagen o vídeo.', type:'error'}); return;};
			const media = await client.decryptMedia(request.extras.id);
			resolve({content: media, type: (type == 'video' ? 'mp4sticker' : 'sticker')});
		}catch(err){
			logger.error(`(Processing sticker) ${err}`);
			reject({content: 'No se pudo convertir el sticker.', type:'error'});
		}
	});
}