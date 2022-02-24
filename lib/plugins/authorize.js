const db = require('../db')('auth');

module.exports = (request, client)=>{
	return new Promise((resolve, reject) => {
		if(!request.authorized.isAdmin){ 
			reject({content: 'No tienes permiso para eso.', type: 'error'}); 
			return;
		}	
		
		//Add contact id to authorized contacts db
		if(!request.authorized.isAuthorized){
			const authorizedContacts = db.get('authorized_contacts');
			authorizedContacts.push(request.extras.to);
			if(db.update('authorized_contacts', {'authorized_contacts': authorizedContacts})){
				resolve({title:'Contacto o grupo autorizado', content: `Bienvenid@ a ${process.env.BOT_NAME}.`, type: 'text'});
			}else{
				reject({content: 'Ha ocurrido un error al autorizar contacto.', type: 'error'});
			}
		}else{
			reject({content: 'Este contacto ya está autorizado.', type: 'error'});
		}
	});
}