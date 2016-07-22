function WigetController($scope) {
    function findTemplate(template) {
        return "http://localhost:8080/nire/widgets/" + template + ".htm";
    }

    $scope.template = findTemplate($scope.message.template);
    $scope.data = $scope.message.data;
}

angular.module('nire.controllers')
    .controller('widgetController', WigetController);
