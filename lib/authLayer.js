const _ = require('underscore'),
 config = require('./config'),
 	 db = require('./db')('auth');

//Authorizing the origin of each message
module.exports = function (message) {
	const isAuthorized = db.get('authorized_contacts').includes(message.from),
		  isAdmin = _.isEqual(message.sender.id, config('adminID'));

	return {isAuthorized:isAuthorized, isAdmin:isAdmin};
}