const tokenizer = require('string-tokenizer'),
 	  plugins = require('./plugins'),
	  config = require('./config'),
	  logger = require('./services/logger');

//Handling all command request from client
const handle = async (client, message)=>{

	if(!validMessage(message)) 
		return;

	const authorized = require('./authLayer.js')(message),
		  from 	   = message.fromMe ? message.to : message.from;

	if(!authorized.isAuthorized && !authorized.isAdmin){
		client.reply(from, `*[No autorizado]:* Para disfrutar de ${config('botName')}, ponte en ` 
							  + `contacto con el Administrador. [+${process.env.ADMIN_NUMBER}]`, message.id);
		logger.warn(`Unauthorized request from [${from}]`);
		return;
	}

	let request = message.type === 'chat' ? parseBody(message.body) : parseBody(message.caption);
	request.authorized = authorized;
	request.extras = message;
	request.from = from;

	const response = await plugins(request, client);
	
	//Handling responses by type
	try{
		switch(response.type){
			case 'text':
				await client.reply(from, `*[${response.title}]*\n\n${response.content}`, message.id)
				break;
			case 'image':
				await client.sendImage(from, response.content, null, response.caption, message.id)
				break;
			case 'sticker':
				await client.sendImageAsSticker(from, `data:image/webp;base64,${response.content}`, {author: config('botName'), pack: `Created by ${config('botName')}`})
				break;
			case 'audio':
				await client.sendPtt(from, `data:audio/mpeg;base64,${response.content}`)
				break;
			case 'error':
				await client.reply(from, `*[Error]:*\n\n${response.content}`, message.id)
				break;
			default:
				logger.warn(response);
				await client.reply(from, 'Ha ocurrido un problema.', message.id);
		}
	}catch(err){
		logger.error(`(Sending ${response.type}) ${err}`);
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