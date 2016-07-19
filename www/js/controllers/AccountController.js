function AccountController($scope, $state, HealthStore, Monitor, userStorage, Chats, Connection) {
    
    function loadUserData() {
        console.log("loading user data")
        Connection.request("account/get").then(function(response) {
            console.log("Reciviendo respuesta", response);
            $scope.nombre = response.data.data.name?response.data.data.name:"";
            $scope.fechaNacimiento = response.data.data.date?response.data.data.date:"";
            $scope.altura = response.data.data.height?response.data.data.height + "cm":"";
            $scope.peso = response.data.data.weight?response.data.data.weight + "Kg":"";
            $scope.genero = response.data.data.gender?getGender(response.data.data.gender):"";
        });
    }

    function getGender(gender) {
        return gender == "man"? "Hombre" : "Mujer";
    }

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.settings = {
            serverMonitor: Monitor.isEnabled()
        };
        console.log("entra")
        loadUserData();
    });

    $scope.$watch("settings.serverMonitor", function(current) {
        if(current) Monitor.start();
        else Monitor.stop();
    });

    $scope.signOut = function () {
        console.log("Sign-Out");
        $state.go('signin');
    };

    // TODO: ESTO NO PINTA NADA AQUÍ, ES SOLO UNA PRUEBA!!
    $scope.initHealthTracking = function() {
        HealthStore.alertData();
    };

    // TODO: Reiniciar mensajes para testing.
    $scope.restartMessages = function() {
        console.log("Borrando estados");

        Chats.clear();
        userStorage.messages.length = 0;
        userStorage.responses = {};
    };

    // TODO: Reiniciar conversacion para testing.
    $scope.restartConversation = function() {
        var username = window.localStorage.username;
        Connection.request("debug/debugNotifications/restartMovistarConversation", { username: username })
                .then(function(response) {
                    console.log("Reciviendo respuesta", response);
                    if(response.data.status == "ok")
                        $scope.restartMessages();
                });
    };

    $scope.showHelp = function() {
        $state.go('review');
    }
}

angular.module('nire.controllers')
    .controller('AccountCtrl', AccountController)
