/**
 * Represents the contacts model.
 * It just store a contact list
 * @constructor
 */
function ContactList(){
	this.contacts = [];
};

/**
 * Init the model using Database.
 * Get all elements form contacts table
 * See {@link Database}.
 */
ContactList.prototype.init = function(){
	return Database.get('contacts').then(function(data){
		this.contacts = data;
	}.bind(this));
}

/**
 * Refresh the model using Webservice.
 * Clean database and init it with the http request callback
 * See {@link Database} and {@link Core}
 */
ContactList.prototype.refresh = function() {
	delete this.contacts;
	var self = this;
	return Promise.all([
		Database.clean('contacts'), 
		Core.http('GET', 'http://www.mocky.io/v2/576bae931100003d0666670a')
	]).then(function(values){
		self.contacts = JSON.parse(values[1]);
		Database.insert('contacts', self.contacts);
	});
};


/**
 * Add a new contact.
 * See {@link Database} 
 */
ContactList.prototype.addContact = function(contact) {
	this.contacts.push(contact);
	Database.insert('contacts', contact);
}

/**
 * Delete contact using ID attributes.
 * See {@link Database} 
 */
ContactList.prototype.deleteContact = function(contact) {
	this.contacts.splice(this.contacts.indexOf(contact), 1);
	Database.delete('contacts', contact.id);
}

