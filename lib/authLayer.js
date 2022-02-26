const _ = require('underscore'),
 	 db = require('./db')('auth');

//Authorizing the origin of each message
module.exports = function (message) {
	const authorizedContacts = db.get('authorized_contacts'),
		  isAuthorized = authorizedContacts ? authorizedContacts.includes(message.from) : false,
		  isAdmin = _.isEqual(message.sender.id, `${process.env.ADMIN_NUMBER}@c.us`);

	return {isAuthorized:isAuthorized, isAdmin:isAdmin};
}