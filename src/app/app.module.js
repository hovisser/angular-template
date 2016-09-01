require('angular');
require('angular-route');
require('angular-ui-bootstrap');

//definition of the sharedServices
angular.module('sharedServices',[]);

//route module
require('./app.route.js');
//home module
require('./components/home/home.module.js');

//now put it all together in the app module
angular.module('app', ['sharedServices', 'ui.bootstrap', 'routing', 'home' ]);
