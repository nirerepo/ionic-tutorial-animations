function MessageDirective(Login, $state, Chats, HealthStore) {
    function LinkFunction(scope) {
        scope.template = "templates/chat/" + scope.message.type + ".html";
    }

    function ControllerFunction($scope) {
        // Aca se envian los option buttons
        $scope.sendResponseOption = function(opt) {
            // TODO: Este no es el lugar de esto
            if(opt.script)
                $scope[opt.script]();

            opt.answer = opt.value;
            Chats.replyMessage(opt, $scope.message.id);
        };

        // Aca se envian todas las demás cosas.
        $scope.sendResponse = function() {
            console.log($scope.message.value)
            var response =  { value: $scope.message.value, event: $scope.message.event };
            Chats.replyMessage(response, $scope.message.id);
        };

        $scope.getResponse = function() {
            return Chats.getResponse($scope.message.id);
        };

        $scope.sendResponseNumber = function() {
            var x;
            var value = $scope.message.value;
            if(isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x))
                $scope.sendResponse();
            else
                plugins.toast.show('Debe ingresar un numero entero', 5000, 'top');
        }

        $scope.sendResponseDate = function() {
            var value = $scope.message.value;
            if(value instanceof Date && value < new Date())
                $scope.sendResponse();
            else
                plugins.toast.show('La fecha seleccionada no es valida', 5000, 'top');
        }

        $scope.initHealthTracking = function(){
            console.log("pedido de inicializacion de fit :D");
            HealthStore.autorizeHealthService();
        };

        $scope.redirect = function(page) {
            $state.go(page);
        }
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
