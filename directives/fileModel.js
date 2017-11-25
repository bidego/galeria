app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            // Every tame the elment changes
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, lement[0].files[0]);
                })
            }
        }
    }
}])