app.services('multipartForm', ['$http', function($http){
    this.post = (uploadUrl, data) {
        var fd = new FormData()
        for(var key in data)
            fd.append(key, data[dey])
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined }
        })
    }
}])