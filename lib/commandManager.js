const tokenizer = require('string-tokenizer'),
 	  plugins = require('./plugins'),
	  config = require('../config');

//Handling all command request from client
const handle = async (client, message)=>{

	if(!validMessage(message)) 
		return;

	const authorized = require('./authLayer.js')(message),
		  from 	   = message.fromMe ? message.to : message.from;

	if(authorized.isAuthorized || authorized.isAdmin){

		let request = message.type === 'chat' ? parseBody(message.body) : parseBody(message.caption);
		request.authorized = authorized;
		request.extras = message;

		const response = await plugins(request, client);
		
		//Handling responses by type
		switch(response.type){
			case 'text':
				client.reply(from, `*[${response.title}]*\n\n${response.content}`, message.id)
				.catch((erro) => {
					console.error('Error when sending: ', erro);
				});
				break;
			case 'image':
				client.sendImage(from, response.content, null, response.caption, message.id)
				.catch((erro) => {
					console.error('Error when sending: ', erro);
				});
				break;
			case 'sticker':
				client
				.sendImageAsSticker(from, `data:image/webp;base64,${response.content}`, {author: config('botName'), pack: `Created by ${config('botName')}`})
				.catch((erro) => {
				  console.error('Error when sending: ', erro);
				});
				break;
			case 'audio':
				client.sendFileFromBase64(from, `data:audio/mpeg;base64,${response.content}`)
				.catch((erro) => {
					console.error('Error when sending: ', erro);
				});
				break;
			case 'error':
				client.reply(from, `*[Error]:* ${response.content}`, message.id)
				.catch((erro) => {
					console.error('Error when sending: ', erro);
				});
				break;
			default:
				console.error(response);
				client.reply(from, 'Ha ocurrido un problema.', message.id);
		}

	}else{
		client.reply(from, `*[No autorizado]:* Para disfrutar de ${config('botName')}, ponte en ` 
							  + `contacto con el Administrador. [+${process.env.ADMIN_NUMBER}]`, message.id);
		console.log(`Unauthorized request from [${from}]`);
	}
}

//Parse message to be handled by plugins
function parseBody(body){
	const token = tokenizer()
		.input(body)
		.token('command', /(?:\/)(\w{2,})/)
		.token('args', / (.+)/)
		.resolve();

	return {command: token.command, args: token.args};
}

//Validate message if can be handled
function validMessage(message){
	const type 	  = message.type,
		  caption = message.caption, 
		  body 	  = message.body;

	switch(type){
		case 'chat':
			return body.charAt(0) === '/';
		case 'image':
			return caption ? caption.charAt(0) === '/' : false;
		default:
			return false;
	}
}

module.exports = {
	handle: handle
}