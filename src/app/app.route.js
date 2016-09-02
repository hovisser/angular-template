//main routing module
angular.module('routing',['ngRoute']);
angular.module('routing').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    'use strict';
    $locationProvider.html5Mode(true);

    $routeProvider.when("/", {
          title: "Home",
          templateUrl : "home/home.view.html"
      });
}]);

angular.module('routing').run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });
}]);
