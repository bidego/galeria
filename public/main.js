angular.module('angularGaleria', [])

function mainController($scope, $http) {

    // INITIALIZE GLOBAL VARS FOR BINDING DATA
    $scope.formData = {}
    $scope.galeriaData = {}

    // LOAD SECTIONS ON PAGE LOADED
    //Cuando se cargue la pagina, pide las galerias de mongodb a la api
    $http.get('/api/galerias')
        .success( data => {
            $scope.galerias = data
            console.log(data)
        })
        .error( data => {
            console.log('Error: ' + data)
        })
    
    // CREATE SECCTION
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

    // READ SECTION DETAILS
    $scope.showDetails = id => {
        $http.get('/api/galeria/'+id)
            .success( data => {
                $scope.details = data;
            })
    }

    // ADD PHOTO TO SECTIONS
    $scope.addPhotoToGaleria = (id) => {
        $http({ url: '/api/galeria/uploadPhoto/'+id, method:'POST', data: $scope.galeriaData, headers: {'Content_type': 'multipart/form-data'} })
            .success( data => {
                $scope.formAddPhoto = data
                console.log(data)
            })
    }

    // DELETE SECTION
    //Borramos una galeria a través de la api
    $scope.deleteGaleria = id => {
        if(confirm("Do you want to delete this collection?")) {
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
        /*
    var socket = io()
    socket.on('connect', () => {
        socket.emit('ferret', 'tobi', data => {
            console.log(data)
        })
    })*/

}