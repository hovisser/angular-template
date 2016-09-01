//main routing module
angular.module('routing',['ngRoute']);
angular.module('routing').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    'use strict';
    $locationProvider.html5Mode(true);

    $routeProvider.when("/", {
          templateUrl : "home/home.view.html"
      });
}]);
