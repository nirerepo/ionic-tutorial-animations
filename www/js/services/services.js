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
                msgAnimator = $interval(function() {
                    var msg = '';
                    if (receivedMessages.length > 0) {
                        console.log(msg);
                        msg = receivedMessages.shift();
                        messages.push(msg.message);
                        console.log(messages);
                    }
                }, 500);
            },
            stop: function() {
                $interval.cancel(msgAnimator);
            }
        }
    }])
    .factory('Monitor', ['$rootScope', '$interval', function($rootScope, $interval) {
        var externalMessages = [
            { source: 'system', type: 'message', text: 'Parece que tu ingesta de calorías está por debajo de lo normal.'},
            { source: 'system', type: 'message', text: '¿Puedo ayudarte sugiriéndote alguna idea para completar bien el día?', options: ['No, gracias', '¡Cuéntame!']},
            { source: 'user', type: 'message', text: '¡Cuéntame!'},
            { source: 'system', type: 'message', text: 'Veamos...'},
            { source: 'system', type: 'message', text: 'Ayer solamente hiciste dos tomas'},
            { source: 'system', type: 'message', text: 'Hacer 5 tomas al día es importante para acelerar el metabolismo'},
            { source: 'system', type: 'options', options: [
                    { text: '¡Lo tendré en cuenta!'},
                    { text: 'Comí algo más'},
                    { text: 'Necesito más ayuda'}
                ]
            }
        ];
        var i = 0;
        var msgMonitor = $interval(function() {
            if (i < externalMessages.length) {
                $rootScope.$broadcast('nire.chat.messageIncoming', { value: true });
                $rootScope.$broadcast('nire.chat.messageReceived', { message: externalMessages[i]})
                i++;
            }
        }, 3000);

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
    .factory('FoodSearch', function ($http, $q) {
    //
    // http://search.nire.co/contenidos_es_es/_search?q=name:*Ibup**&fields=id,name&sort=_score:asc
    //
    return {
        plateByName: function (queryText) {
            var rdo = $q.defer();
            var query = "http://search.nire.co/platos_es_co/_search?q=nombredieta:*" + queryText + "**&fields=id,nombredieta&sort=_score:asc";
            $http.get(query)
                .then(function (res) {
                console.log("RES: ", res);
                rdo.resolve(res);
            }).catch(function (data, status) {
                console.error('Gists error', response.status, response.data);
            })
                .finally(function () {
                console.log("finally finished gists");
            });
            return rdo.promise;
        }
    };
});
