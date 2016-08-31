module.exports = function($scope) {
	$scope.message = 'Two birds killed with one stone!'

  $scope.getMessage = function(){
     return $scope.message;
  };
}
