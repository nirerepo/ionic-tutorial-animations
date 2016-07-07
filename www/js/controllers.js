angular.module('nire.controllers', [])
    .controller('AccountCtrl', function ($scope, $state, HealthStore, Monitor, userStorage, Chats, Connection) {
        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.settings = {
                serverMonitor: Monitor.isEnabled()
            };
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
            console.log("Borrando estado");

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
    })

.controller('HelpCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, Help) {
  $scope.data = {};
  $scope.data.bgColors = [];
  $scope.data.currentPage = $stateParams.startpage;
  console.log("Current: ", $scope.data);
  Help.loadPages($scope, $ionicNavBarDelegate);
  $ionicNavBarDelegate.showBackButton(true);
  if (window.plugins && window.plugins.toast)
    window.plugins.toast.show("This is a help message", "long", "center");
})
;
