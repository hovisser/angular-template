module.exports = function($scope, homeService, $log) {

	$service = new homeService();

	//stupid example but you get the drift
  $scope.getMessage = function(){
     return $service.getMessage();
  };
}
