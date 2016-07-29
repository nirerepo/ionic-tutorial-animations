function MessageDirective(Login, $state, Chats, HealthStore) {
    function LinkFunction(scope) {
        scope.template = "templates/chat/" + scope.message.type + ".html";
    }

    function ControllerFunction($scope) {
        /**
         * Metodo Response para mensjes del tipo Option
         * No solo la interpretación de los parametors es diferente, tambien puede ejecuta un JS  
         */
        $scope.sendResponseOption = function(opt) {
            // TODO: Este no es el lugar de esto
            if(opt.script)
                $scope[opt.script]();

            opt.answer = opt.value;
            Chats.replyMessage(opt, $scope.message.id);
            $scope.hasResponse = true;
        };

        /**
         * Metodo Response para casos generales, sin validacion
         */
        $scope.sendResponse = function() {
            var response =  { value: $scope.message.value, event: $scope.message.event };
            Chats.replyMessage(response, $scope.message.id);
            $scope.hasResponse = true;
            console.log($scope.hasResponse)
        };

        $scope.getResponse = function() {
            return Chats.getResponse($scope.message.id);
        };

        $scope.hasResponse = $scope.getResponse() != null;

        /**
         * Metodo Response para datos numéricos enteros
         */
        $scope.sendResponseNumber = function() {
            var x;
            var value = $scope.message.value;
            if(isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x))
                $scope.sendResponse();
            else
                plugins.toast.show('Debe ingresar un numero entero', 5000, 'top');
        };

        /**
         * Metodo Response para fechas
         */
        $scope.sendResponseDate = function() {
            var value = $scope.message.value;
            console.log(value)
            if(value instanceof Date && value < new Date()){
                $scope.message.value = value.toISOString().split('T')[0]
                $scope.sendResponse();
            }
            else
                plugins.toast.show('La fecha seleccionada no es valida', 5000, 'top');
        };

        /**
         * TODO: colocar en algun lugar bonito, aquí no queda bien.
         */
        $scope.initHealthTracking = function(){
            console.log("pedido de inicializacion de fit :D");
            HealthStore.autorizeHealthService();
        };

        $scope.redirect = function(page) {
            $state.go(page);
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
