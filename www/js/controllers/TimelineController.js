function TimelineController($scope, $ionicActionSheet, Timeline, $rootScope){
    // Cada vez que se muestra el Timeline le solicitamos al servicio
    // la información actualizada.
    $scope.$on("$ionicView.beforeEnter", function () {
       $scope.nutrition = Timeline.get().nutrition; 
       $scope.exercises = Timeline.tracks.exercises; 
    });

    $scope.cards = [
        {},
        {}
    ];

    var self = this;

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function (index) {
        var newCard = $scope.cards.push(newCard);
    };
    $scope.trackBlock = function(mealId) {
        return !Timeline.trackBlockExists(mealId);
    }
    $scope.hasExercises = function() {
        return $scope.exercises.length > 0;
    }
    $scope.calcularTotalCalorias = function(mealId) {
        return Timeline.calcularTotalCalorias(mealId);
    }
    $scope.caloriasConsumidas = function() {
        return Timeline.caloriasConsumidas()
    }
}

angular.module('starter.controllers')
    .controller('DashCtrl', TimelineController);
