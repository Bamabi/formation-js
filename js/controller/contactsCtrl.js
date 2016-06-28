/**
 * Represents the contacts controller.
 * It manage bindings with contact model and views
 * It just store a contact list
 * @constructor
 */
function ContactCtrl(){
	this.model = new ContactList();
}

/**
 * Init the controller and bind event.
 * Get all elements form contacts table
 * See {@link Core} to make http request.
 */
ContactCtrl.prototype.init = function() {
	var self = this;
	
	Core.http('GET', 'partials/form.html').then(function(data){
		$('#form').innerHTML = data; 
		$('#contactSubmit').addEventListener('click',function(event){
			event.preventDefault();
			var contact = Core.map('#contactForm');
			self.model.addContact(contact);
			self.renderContact(contact);
		});
	});

	$('#contactRefresh').addEventListener('click',function(event){
		event.preventDefault();
		self.model.refresh().then(function(){
			self.renderList();
		});
		
	});

	this.model.init().then(function(){
		self.renderList();
	});
}

/**
 * Display contact list on the view.
 * It use renderContact to display contact item
 */
ContactCtrl.prototype.renderList = function() {
	$('#contactList').innerHTML = '';
	for(var i = 0; i < this.model.contacts.length; i++){
		this.renderContact(this.model.contacts[i]);
	}
}

/**
 * Display contact as line in the list.
 */
ContactCtrl.prototype.renderContact = function(contact) {
	var row = document.createElement('tr');
	row.id = contact.id;
	var table = $('#contactList');
	var attributes = Object.keys(contact);
	for(var i = 0; i < attributes.length; i++ ){
	 	var cell = document.createElement('td');    
	    var cellText = document.createTextNode(contact[attributes[i]] || ''); 
		cell.appendChild(cellText);
	    row.appendChild(cell);
	}

	var cell = document.createElement('td');   
	var button = document.createElement('button');
	button.className='btn btn-warning pull-right glyphicon glyphicon-remove';
	button.addEventListener('click',function(){
		this.model.deleteContact(contact);
		table.removeChild(document.getElementById(contact.id));
	}.bind(this));
	cell.appendChild(button);
	row.appendChild(cell);
	table.appendChild(row);
}



