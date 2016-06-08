function TimelineController($scope, $ionicActionSheet, Timeline, $rootScope){
    // Cada vez que se muestra el Timeline le solicitamos al servicio
    // la información actualizada.
    $scope.$on("$ionicView.beforeEnter", function () {
       $scope.nutrition = Timeline.get(); 
    });

    $scope.cards = [
        {},
        {}
    ];

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function (index) {
        var newCard = $scope.cards.push(newCard);
    };
    $scope.trackBlock = function(mealId) {
        return !Timeline.trackBlockExists(mealId);
    }
    $scope.calcularTotalCalorias = function(mealId) {
        return Timeline.calcularTotalCalorias(mealId);
    }
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
}

angular.module('starter.controllers')
    .controller('DashCtrl', TimelineController);
