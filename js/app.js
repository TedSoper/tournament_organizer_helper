(function(){

	var app = angular.module("tournamentOrganizer", ["ngRoute"]);

	app.config(function($routeProvider){
		$routeProvider
			.when("/main", {
				templateUrl: "main.html",
				controller: "MainController"
			})
			.when("/registration", {
				templateUrl: "registration.html",
				controller: "RegistrationController"
			})
			.otherwise({redirectTo:"/main"});
	});
}());