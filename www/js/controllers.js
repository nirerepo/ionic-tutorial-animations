angular.module('nire.controllers', [])
    .controller('AccountCtrl', function ($scope, $state, HealthStore, Monitor, $localStorage, Chats) {
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

        $scope.restartMessages = function() {
            Chats.clear();
            $localStorage.messages.length = 0;
            $localStorage.responses = {};
        };
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
