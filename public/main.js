angular.module('angularGaleria', [])

function mainController($scope, $http) {
    $scope.formData = {}

    //Cuando se cargue la pagina, pide las galerias de mongodb a la api
    $http.get('/api/galerias')
        .success( data => {
            $scope.galerias = data
            console.log(data)
        })
        .error( data => {
            console.log('Error: ' + data)
        })
    
    //Enviamos el texto a la api al añadir nueva galeria.
    $scope.createGaleria = () => {
        $http.post('/api/galerias', $scope.formData)
            .success( data => {
                $scope.formData = {}
                $scope.galerias = data
                console.log(data)
            })
            .error( data => {
                console.log('Error : ' + data)
            })
    }

    //Borramos una galeria a través de la api
    $scope.deleteGaleria = id => {
        $http.delete('/api/galerias/' + id)
            .success( data => {
                $scope.galerias = data
                console.log(data)
            })
            .error( data => {
                console.log('Error : ' + data)
            })
    }
}