module.exports = (request, client)=>{
	return new Promise((resolve) => {
		resolve({title: process.env.BOT_NAME, content: 'Escribe *[/help]* para ver comandos disponibles.\n\n'+
						  			  		   '_Desarrollado por Kevin Tobar <kstmsoft@gmail.com>_', type: 'text'});
	});
}