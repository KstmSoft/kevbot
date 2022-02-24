require('dotenv').config();

const wa = require('@open-wa/wa-automate');
const commandManager = require('./lib/commandManager.js');

//Setting up main message listener
wa.create({
	sessionId: process.env.BOT_NAME,
	multiDevice: false,
	authTimeout: 60,
	blockCrashLogs: true,
	disableSpins: true,
	headless: true,
	hostNotificationLang: 'PT_BR',
	logConsole: false,
	popup: true,
	qrTimeout: 0,
  }).then(client => start(client));

//Handling all received messages
function start(client) {
	client.onAnyMessage((message) => {
		commandManager.handle(client, message);
	});
}