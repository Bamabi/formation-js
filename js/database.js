/**
 * Represents a DAO to access web sql.
 * @constructor
 */
function Database(){
	if(window.openDatabase){
		this.db = openDatabase('annuaire', '1.0', 'database', 2000000, function(db){
			db.changeVersion('', '1.0');
		});
	}
};

/**
 * Create a new table in the database.
 * @param {string} table - The table name.
 * @param {Array} fields - The field list.
 */
Database.prototype.create = function(table, fields){
	this.db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+ table +' (' + fields.join(',') +')');
	});
};

/**
 * Get all objects from the giving table.
 * @param {string} table - The table name.
 */
Database.prototype.get = function(table){
	var deferred = Promise.defer();
	this.db.readTransaction(function (t) {
		t.executeSql('SELECT * FROM ' + table, [], function (t, data) {
			var result = [];
		 	var len = data.rows.length;
		    for (var i = 0; i < len; i++) {
		        var row = data.rows.item(i);
		        result.push(row);
		    }
			deferred.resolve(result);
		});
	});

	return deferred.promise;
}

/**
 * Insert data in the giving table.
 * @param {string} table - The table name.
 * @param {Object} data - Can be a simple object or an array.
 */
Database.prototype.insert = function(table, data){
	if(!table || !data) {
		return;
	}

	//All parameter need to be an array
	var objs =  Array.isArray(data) ? data : [data];

	this.db.transaction(function(tx) {

		for(var i = 0; i < objs.length; i++){
			var obj = objs[i];
			var fields = Object.keys(obj);

			var values = [];
			for(var j = 0; j < fields.length; j++) {
				var value = obj[fields[j]];
				if(Number.isInteger(value)) {
					values.push(value);
				} else {
					values.push("'" + value + "'");
				}
				
			}
			var request = 'INSERT INTO '+ table +' (' + fields.join(',') + ') VALUES(' + values.join(',') +')';
			console.log(request);
			tx.executeSql(request);
		}

	});
}

/**
 * Clean the giving table.
 * @param {string} table - The table name.
 */
Database.prototype.clean = function(table){
	var deferred = Promise.defer();

	this.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM ' + table, [], function(data){
			deferred.resolve(data);
		});
	});

	return deferred.promise;
}
/**
 * Delete an object to the giving table.
 * Object is represent by the giving ID
 * @param {string} table - The table name.
 * @param {number} id - The object ID (for the where clause).
 */
Database.prototype.delete = function(table, id){
	var deferred = Promise.defer();
	this.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM ' + table+ ' WHERE id =' + id, [], function(data){
			deferred.resolve(data);
		});
	});
	return deferred.promise;
}

