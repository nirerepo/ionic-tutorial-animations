/// <reference path="../../typings/index.d.ts" />
angular.module('nire.services', [])
    .factory('Chats', ['$rootScope', '$interval', '$timeout', function($rootScope, $interval, $timeout) {
        var receivedMessages = [];  // Recibidos, aún sin mostrar

        // Acumulamos los mensajes ya recibidos desde el monitor...
        // ...y se mostrarán suavemente cuando se vuelva a abrir el chat

        $rootScope.$on('nire.chat.messageReceived', function(event, msg) {
            // TODO: ¿Quizás en paralelo a esto, podemos almacenar los recibidos
            // en localstorage, e inicializar desde ahí al arrancar el servicio?
            $timeout(function() {
                $rootScope.$broadcast('nire.chat.messageIncoming', { value: false });
                receivedMessages.push(msg);
            }, 700);
        });

        var msgAnimator;

        return {
            start: function(messages, pending) {
                console.log("Chat animator START");
                msgAnimator = $interval(function() {
                    var msg = '';
                    if (receivedMessages.length > 0) {
                        msg = receivedMessages.shift();
                        console.log('Mensaje mostrado', msg);
                        messages.push(msg.message);
                        window.localStorage.shownMessages = JSON.stringify(messages);
                    }
                }, 1000);
            },
            stop: function() {
                $interval.cancel(msgAnimator);
            }
        }
    }])
    .factory('Help', function () {
    return {
        loadPages: function ($scope, $ionicNavBarDelegate) {
            //$ionicNavBarDelegate.title('Cómo funciona Nire...');
            for (var i = 0; i < 5; i++) {
                $scope.data.bgColors.push("bgColor_" + i);
            }
            var setupSlider = function () {
                //some options to pass to our slider
                $scope.data.sliderOptions = {
                    initialSlide: $scope.data.currentPage,
                    direction: 'horizontal',
                    speed: 250 //0.3s transition
                };
                //create delegate reference to link with slider
                $scope.data.sliderDelegate = null;
                //watch our sliderDelegate reference, and use it when it becomes available
                $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
                    if (newVal != null) {
                        $scope.data.sliderDelegate.on('slideChangeEnd', function () {
                            $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                            //use $scope.$apply() to refresh any content external to the slider
                            $scope.$apply();
                        });
                    }
                });
            };
            setupSlider();
        }
    };
})
    .factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}])
;
