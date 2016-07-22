function WigetController($scope) {
    function findTemplate(template) {
        return "http://localhost:8080/nire/widgets/" + template + ".htm";
    }

    $scope.template = findTemplate($scope.message.template);

    $scope.data = { review: { summary: {
        title: "hola",
        needlePosition: "OK",
        messages: ["hola como estas", "esperemos que funcione"]
    } } };
}

angular.module('nire.controllers')
    .controller('widgetController', WigetController);
