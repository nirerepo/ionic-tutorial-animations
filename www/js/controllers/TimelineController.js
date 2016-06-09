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
    $scope.showActionsheet = function (plato, mealType) {
        var title = '';
        if (plato)
            title = plato.name;
        $ionicActionSheet.show({
            titleText: title,
            destructiveText: '<i class="icon ion-trash-b"></i>Eliminar',
            cancelText: 'Cancelar',
            cancel: function () {
                console.log('CANCELLED');
            },
            destructiveButtonClicked: function () {
                Timeline.eliminarPlato(plato, mealType)
                return true;
            }
        });
    };
}

angular.module('starter.controllers')
    .controller('DashCtrl', TimelineController);
