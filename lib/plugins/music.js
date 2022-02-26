const _ = require('underscore'),
	search = require('yt-search'),
	axios = require('axios'),
	config = require('../config'),
	logger = require('../services/logger');

module.exports = async (request, client) => {
	return new Promise(async (resolve, reject) => {

		if (!request.args) {reject({content: 'Uso /music [query]', type: 'error' }); return;}

		try {
			const query = request.args.replace(/\./g, '').toLowerCase(),
				result = (await search(query)).videos[0];

			if (result >= 600) reject({content: 'El audio supera los 10 mins.', type: 'error'});

			//Sending feedback with some information of video before send audio.
			client.reply(request.from, `*[🎵 ${result.title} | ${result.timestamp}]*\n\nSe está procesando, por favor espera un momento...`, request.extras.id)
			//-------------------------------------------

			const obj = {
				url: result.url,
				format: 'mp3'
			};
			
			const data = _.keys(obj)
			.map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
			.join('&');

			const buffer = await axios({
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data,
				url: config('mediaProvider'),
				responseType: 'arraybuffer'
			});

			resolve({content: (new Buffer.from(buffer.data, 'binary')).toString('base64'), type: 'audio'});
		} catch (err) {
			logger.error(`(Getting audio) ${err}`);
			reject({content: 'No se pudo obtener el audio.', type: 'error'});
		}
	});
}