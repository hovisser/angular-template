module.exports = function($scope, homeService) {

	$service = new homeService();
	
	//stupid example but you get the drift
  $scope.getMessage = function(){
     return $service.getMessage();
  };
}
