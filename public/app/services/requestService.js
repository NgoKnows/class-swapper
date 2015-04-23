angular.module('requestService', [])

.factory('Request', function($http) {

	// create a new object
	var requestFactory = {};

	// get all requests from a user
	requestFactory.allUser = function(username) {
		return $http.get('/api/' + username + '/requests' );
	};

    //adds a new request
    requestFactory.add = function(requestData) {
        return $http.post('/api/requests/', requestData);
    };

    //get all requests in db
    requestFactory.all = function() {
        return $http.get('/api/requests/');
    };

    //get request with this id
    requestFactory.get = function(id) {
        return $http.get('/api/requests/' + id);
    };

    //deletes request with this id
    requestFactory.delete = function(id) {
        return $http.delete('/api/requests/' + id);
    };

    //updates request with this id
    requestFactory.update = function(id, requestData) {
        return $http.put('/api/requests/' + id, requestData);

    return requestFactory;
});
