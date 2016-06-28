/**
 * Represents the core application.
 * Common function could be here
 * @constructor
 */
function Core(){};

var $ = function(selector){
	return document.querySelector(selector);
}
/**
* Map a form with object
* Based on model attribute
* @param {string} selector - The form selector (ID for example).
*/
Core.prototype.map = function(selector){

	var form = $(selector);
	var inputs = form.getElementsByTagName("input");
	var json = {
		id: new Date().getTime()
	};
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].hasAttribute('model')){
			json[inputs[i].getAttribute('model')] = inputs[i].value;
		}
	}
	
	return json;
}

/**
* Make an http request with promise and XMLHttpRequest
* Use then(resolve, reject) to manage data
* @param {string} method - HTTP Method, GET, POST, PUT.
* @param {string} url - The WS url.
*/
Core.prototype.http = function(method, url) {
	
  	var deferred = Promise.defer();
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open(method, url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        deferred.resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        deferred.reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      deferred.reject(Error("Network Error"));
    };

    // Make the request
    req.send();

    return deferred.promise;

}

