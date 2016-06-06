angular.module('starter.controllers', [])
    .controller('DashCtrl', function ($scope, $ionicActionSheet, Timeline) {
    $scope.cards = [
        {},
        {}
    ];
    Timeline.get().then(function(result){
        $scope.nutrition = result.data.data.body.nutrition
    });
    //$scope.desayuno = Timeline.desayuno();
    console.log($scope.desayuno);
    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function (index) {
        var newCard = $scope.cards.push(newCard);
    };
    //
    $scope.showActionsheet = function (plato) {
        var title = '';
        if (plato)
            title = plato.name;
        $ionicActionSheet.show({
            titleText: title,
            buttons: [
                { text: '<i class="icon ion-arrow-move"></i>Cantidades' },
                { text: '<i class="icon ion-arrow-move"></i>Sustituir' }
            ],
            destructiveText: '<i class="icon ion-share"></i>Quitar',
            cancelText: 'Cancel',
            cancel: function () {
                console.log('CANCELLED');
            },
            buttonClicked: function (index) {
                console.log('BUTTON CLICKED', index);
                return true;
            },
            destructiveButtonClicked: function () {
                console.log('DESTRUCT');
                return true;
            }
        });
    };
    //
})
    .controller('ChatDetailCtrl', function ($scope, $state, $stateParams, $interval, $ionicScrollDelegate, Chats) {
        var localStoredShownMessages = [
            { source: 'system', type: 'message', text: 'Bienvenido a Movistar Salud'},
            { source: 'system', type: 'message', text: 'Vamos a ver en qué podemos ayudarte hoy'}
        ];   // Ya mostrados
        $scope.newMessages = [];
        $scope.pending = false;

        /* 
         * Sincronizams con la vista el arrancar y detener el servicio
         * de presentación de mensajes ya recibidos, para controlar su
         * $interval interno.
         */
        $scope.$on('$ionicView.enter', function() {
            $scope.shownMessages = localStoredShownMessages;
            Chats.start($scope.newMessages, $scope.pending);

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
    })
    .controller('AccountCtrl', function ($scope, $state) {
        $scope.settings = {
            enableFriends: true,
            enableOtrascosas: true,
            enableYotramastodavia: true
        };
        $scope.signOut = function () {
            console.log("Sign-Out");
            $state.go('signin');
        };
    })
.controller('TrackCtrl', function($scope, $state, $stateParams, $ionicHistory, FoodSearch) {
    $scope.data = {
        "plates": [],
        "search": ''
    };
    $scope.search = function() {
      console.log("Searching...", $scope.data.search);
      FoodSearch.plateByName($scope.data.search).then(function(matches) {
        $scope.data.plates = matches.data.hits.hits;
      });
    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };
/*
    $scope.search().promise.then(function(rest) {
      console.log("HITS: ", rest.data.hits.hits);
      $scope.data.plates = rest.data.hits.hits;
      console.log("PLATES: ", $scope.data.plates);
    });
*/
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
