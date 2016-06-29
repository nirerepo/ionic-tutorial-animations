function MessageDirective(Login, $state, Chats) {
    function LinkFunction(scope) {
        scope.template = "templates/chat/" + scope.message.type + ".html";
    }

    function ControllerFunction($scope) {
        // Aca se envian los option buttons
        $scope.sendResponseOption = function(opt) {
            opt.answer = opt.value;
            Chats.replyMessage(opt, $scope.message.id);
        };

        // Aca se envian todas las demás cosas.
        $scope.sendResponse = function() {
            var response =  { value: $scope.message.value, event: $scope.message.event };
            Chats.replyMessage(response, $scope.message.id);
        };

        $scope.getResponse = function() {
            return Chats.getResponse($scope.message.id);
        };
    }

    return {
        template: "<div ng-include='template'></div>",
        link: LinkFunction,
        controller: ControllerFunction,
        scope: { message: "=" }
    };
}

angular.module("nire.directives")
    .directive("nireMessage", MessageDirective);
