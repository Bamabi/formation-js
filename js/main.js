

var Database = new Database();
Database.create('contacts', ['id', 'firstName', 'lastName', 'email', 'cellPhone']);

var Core = new Core();

var Contacts = new ContactCtrl();
Contacts.init();


