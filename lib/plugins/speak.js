const textToSpeech = require('@google-cloud/text-to-speech');

module.exports = async (request, client)=>{
	return new Promise( async (resolve, reject) => {
		if(!request.args){
			reject({content: 'Uso /speak [text]', type:'error'});
			return;
		}
		try{
			const params = {
				input: {text: request.args},
				voice: {languageCode: 'es-ES'},
				audioConfig: {audioEncoding: 'MP3'}
			}
			const client = new textToSpeech.TextToSpeechClient(),
			 	  speech = await client.synthesizeSpeech(params);

			resolve({content: (new Buffer.from(speech[0].audioContent, 'binary')).toString('base64'), type: 'audio'});
		}catch(err){
			reject({content: 'No se pudo obtener el audio.', type:'error'});
		}
	});
}