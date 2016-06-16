angular.module('nire.controllers', [])
    .controller('ChatDetailCtrl', function ($scope, $state, $stateParams, $interval, $timeout, $ionicScrollDelegate, Chats) {
        $scope.newMessages = [];
        $scope.pending = false;

        /* 
         * Sincronizams con la vista el arrancar y detener el servicio
         * de presentación de mensajes ya recibidos, para controlar su
         * $interval interno.
         */
        $scope.$on('$ionicView.enter', function() {
            if (window.localStorage.shownMessages)
                $scope.shownMessages = JSON.parse(window.localStorage.shownMessages);
            else
                $scope.shownMessages = [];
            $scope.newMessages = [];
            $timeout(function() {
                Chats.start($scope.newMessages, $scope.pending);
            }, 1000);

        });
        $scope.$on('$ionicView.leave', function() {
            Chats.stop();
        });
        $scope.$on('nire.chat.messageIncoming', function(e, msg) {
            $scope.pending = msg.value;
        });
        $scope.$watch('shownMessages', function(newValue, oldValue) {
            $ionicScrollDelegate.scrollBottom(false);
        }, true);
        $scope.$watch('newMessages', function(newValue, oldValue) {
            $ionicScrollDelegate.scrollBottom(false);
        }, true);

        $scope.showHelp = function (tipo) {
            if (!tipo)
                tipo = '';
            $state.go('help' + tipo, { startpage: 2 });
        };

        $scope.pressOption = function($event, opt, msgId) {
            console.log($event)
            console.log(opt)
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
    .controller('AccountCtrl', function ($scope, $state, messagingService, HealthStore, Monitor) {
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
            window.localStorage.removeItem("shownMessages");
            messagingService.setLastMessage(0);
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
