module.exports = function($scope) {
	$scope.message = 'The template works';

  $scope.getMessage = function(){
     return $scope.message;
  };
}
