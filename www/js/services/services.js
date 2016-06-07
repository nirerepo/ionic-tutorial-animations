/// <reference path="../../typings/index.d.ts" />
angular.module('starter.services', [])
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
    .factory('Monitor', ['$rootScope', '$interval', function($rootScope, $interval) {
        var externalMessages = [
            { id: '1', source: 'system', type: 'message', text: 'Bienvenido a Movistar Salud'},
            { id: '2', source: 'system', type: 'message', text: 'Vamos a ver en qué podemos ayudarte hoy'},
            { id: '3', source: 'system', type: 'card', cardId: 'actividad', title: 'Actividad física. Recomendaciones'},
            { id: '4', source: 'system', type: 'message', text: 'Parece que tu ingesta de calorías está por debajo de lo normal.'},
            { id: '5', source: 'system', type: 'message', text: '¿Puedo ayudarte sugiriéndote alguna idea para completar bien el día?', options: ['No, gracias', '¡Cuéntame!']},
            { id: '6', source: 'user', type: 'message', text: '¡Cuéntame!'},
            { id: '7', source: 'system', type: 'message', text: 'Veamos...'},
            { id: '8', source: 'system', type: 'message', text: 'Ayer solamente hiciste dos tomas'},
            { id: '9', source: 'system', type: 'message', text: 'Hacer 5 tomas al día es importante para acelerar el metabolismo'},
            { id: '10', source: 'system', type: 'options', options: [
                    { text: '¡Lo tendré en cuenta!'},
                    { text: 'Comí algo más'},
                    { text: 'Necesito más ayuda'}
                ]
            },

        ];
        var i = 0;
        var lastShownMessage = null;
        if (window.localStorage.shownMessages != null) {
            lastShownMessage = _.last(JSON.parse(window.localStorage.shownMessages));    
        }
        var msgMonitor = $interval(function() {
            if (i < externalMessages.length) {
                var msg = externalMessages[i];
                if (!lastShownMessage || (msg.id > lastShownMessage.id)) {
                    console.log("Mensaje recibido...", externalMessages[i].id);
                    $rootScope.$broadcast('nire.chat.messageIncoming', { value: true });
                    $rootScope.$broadcast('nire.chat.messageReceived', { message: externalMessages[i]})
                    i++;
                }
            }
        }, 1000);

        return {

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
