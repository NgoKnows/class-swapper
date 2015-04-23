angular.module('classSwapper', ['ngAnimate', 'mainCtrl', 'userCtrl', 'authService', 'userService', 'app.routes'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
    // this attaches the token to the request if it exists
	$httpProvider.interceptors.push('AuthInterceptor');

});
