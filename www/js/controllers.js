angular.module('nire.controllers', [])
    .controller('ChatDetailCtrl', function ($scope, $state, $stateParams, $interval, $timeout, $ionicScrollDelegate, Chats) {
        var INTERVALO_NUEVO_MENSAJE = 3000;
        var cancelInterval = null;

        function showNewMessage() {
            var message = Chats.getNewMessage();
            if(message) $ionicScrollDelegate.scrollBottom(true);
        }

        $scope.$on('$ionicView.enter', function() {
            $scope.messages = Chats.getReadedMessages();
            cancelInterval = $interval(showNewMessage, INTERVALO_NUEVO_MENSAJE);
            $ionicScrollDelegate.scrollBottom(false);
        });

        $scope.$on('$ionicView.leave', function() {
            $interval.cancel(cancelInterval);
            cancelInterval = null;
        });

        $scope.notificationResponded = function(id) {
            return Chats.notificationResponded(id);
        };

        $scope.getResponseText = function(id) {
            return Chats.notificationResponded(id).message;
        };

        $scope.pressOption = function($event, opt, msgId) {
            var el = $event.currentTarget;
            if (opt.script)
                eval(opt.script);
            var elementDisplay = el.style.display;
            Array.prototype.forEach.call(el.parentNode.childNodes, function(child) {
                if (child.tagName == 'DIV' && child != el)
                    child.style.display = 'none';
            });
            el.classList.remove('option');
            el.classList.add('user');
            el.parentNode.classList.remove('options');
            Chats.replyMessage(opt, msgId);
        }
    })
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
