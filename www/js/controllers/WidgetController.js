function WigetController($scope, serverConfig) {
    function findTemplate(template) {
        return serverConfig.widgets + template + ".htm";
    }

    $scope.template = findTemplate($scope.message.template);
    $scope.data = $scope.message.data;
}

angular.module('nire.controllers')
    .controller('widgetController', WigetController);
