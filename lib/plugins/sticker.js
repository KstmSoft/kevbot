const sharp = require('sharp');
module.exports = async (request, client)=>{
	return new Promise( async (resolve, reject) => {
		if(request.extras.type !== 'image'){
			reject({content: 'Necesitas adjuntar una imagen.', type:'error'});
			return;
		}
		try{
			const buffer  = await client.decryptMedia(request.extras.id),
				  editor  = sharp(Buffer.from(buffer.split(';base64,').pop(), 'base64'), {failOnError: false}).ensureAlpha(),
				  sticker = await editor
				  				  .resize(512,512,{
				  				  	fit: 'contain',
				  				  	position: sharp.gravity.centre,
				  				  	background: {r:255, g:255, b:255, alpha:0}
				  				  })
				  				  .webp()
				  				  .toBuffer();
			resolve({content: sticker.toString('base64'), type: 'sticker'});
		}catch(error){
			console.error(error);
			reject({content: 'No se pudo convertir el sticker.', type:'error'});
		}
	});
}