// Start of loading a component
//load required controler and services
var homeService = require('./home.service.js');
var homeController = require('./home.controller.js');

//definition of the home component (should be nicer way for this I think) ?
angular.module('home',['sharedServices', 'ngRoute'])
  .service('homeService', ['$log', homeService])
  .controller('homeController', ['$scope', 'homeService', '$log', homeController]);
