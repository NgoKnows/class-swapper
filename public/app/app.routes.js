angular.module('app.routes', ['ngRoute', 'mainCtrl'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		 //login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
            controllerAs: 'login'
		})
         //create user page
		.when('/create', {
			templateUrl : 'app/views/pages/createUser.html',
   			controller  : 'userCreateController',
            controllerAs: 'user'
		})
//
		//show all users
		.when('/users', {
			templateUrl: 'app/views/pages/allUsers.html',
			controller: 'userController',
			controllerAs: 'user'
		})

        //show current user
		.when('/user', {
			templateUrl: 'app/views/pages/user.html',
			controller: 'userController',
			controllerAs: 'user'
		})

        .otherwise({
			redirectTo: '/'
		});

//
//		// form to create a new user
//		// same view as edit page
//		.when('/users/create', {
//			templateUrl: 'app/views/pages/users/single.html',
//			controller: 'userCreateController',
//			controllerAs: 'user'
//		})
//
//		// page to edit a user
//		.when('/users/:user_id', {
//			templateUrl: 'app/views/pages/users/single.html',
//			controller: 'userEditController',
//			controllerAs: 'user'
//		});

	$locationProvider.html5Mode(true);
});
