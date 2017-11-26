app.controller('addPhotoController', ['$scope', 'multipartForm' function($scope, multipartForm) {
    $scope.customer = {}
    $scope.Submit = () => {
        var uploadUrl = '/upload';
        multipartForm.post(uploadUrl, $scope.customer)
    }
}])