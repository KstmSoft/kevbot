const _ = require('underscore'),
 config = require('./config'),
 	 db = require('./db')('auth');

//Authorizing the origin of each message
module.exports = function (message) {
	const authorizedList = db.get('authorized_contacts'),
		  isAuthorized = authorizedList ? authorizedList.includes(message.from) : false,
		  isAdmin = _.isEqual(message.sender.id, `${process.env.ADMIN_NUMBER}@c.us`);

	return {isAuthorized:isAuthorized, isAdmin:isAdmin};
}