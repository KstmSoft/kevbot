const search = require('yt-search'),
	  axios  = require('axios'),
	  config = require('../config');

module.exports = async (request, client)=>{
	return new Promise( async (resolve, reject) => {
		if(!request.args){
			reject({content: 'Uso /music [query]', type:'error'});
			return;
		}

		try{
			const query  = request.args.replace(/\./g,'').toLowerCase(),
				  result = (await search(query)).videos[0];

			if(result>=600)
				reject({content: 'El audio supera los 10 mins.', type:'error'});

			const buffer = await axios.get(config('mediaProvider') ,{params:{url:result.url, format:'mp3'}, responseType: 'arraybuffer'});
			//Sending feedback with thumbnail with some information of video before send audio.
			client.sendImage(request.extras.from, result.thumbnail, null, `*[${result.title}]* | *${result.timestamp}*`);
			//-------------------------------------------
			resolve({content: (new Buffer.from(buffer.data, 'binary')).toString('base64'), type: 'audio'});
		}catch(err){
			console.error(err);
			reject({content: 'No se pudo obtener el audio.', type:'error'});
		}
	});
}