function TimelineController($scope, $ionicActionSheet, Timeline, $rootScope){
    // Cada vez que se muestra el Timeline le solicitamos al servicio
    // la información actualizada.
    $scope.$on("$ionicView.beforeEnter", function () {
       $scope.timelineDays = Timeline.get();
    });

    $scope.cards = [
        {},
        {}
    ];
    $scope.pageTitle = "Hoy"
    $scope.day = function(){
        
    }

    $scope.data = {
        sliderOptions: {
            initialSlide: Timeline.daysToFetch -1
        }
    }

    var self = this;

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
        if(data.slider.activeIndex == Timeline.daysToFetch -1)
            $scope.pageTitle = "Hoy";
        else if(data.slider.activeIndex == Timeline.daysToFetch -2)
            $scope.pageTitle = "Ayer";
        else 
            $scope.pageTitle = moment().subtract(4 - data.slider.activeIndex, 'days').format("DD MMM");
    });

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function (index) {
        var newCard = $scope.cards.push(newCard);
    };
    $scope.trackBlock = function(mealId, day) {
        return !Timeline.trackBlockExists(mealId, day);
    }
    $scope.hasExercises = function(day) {
        return Timeline.hasExercises(day);
    }
    $scope.calcularTotalCalorias = function(mealId, day) {
        return Math.round(Timeline.calcularTotalCalorias(mealId, day) * 100) / 100;
    }
    $scope.caloriasConsumidas = function(day) {
        return Math.round(Timeline.caloriasConsumidas(day) * 100) / 100;
    }

    $scope.tiempoEjercicio = function(day) {
        return Math.round(Timeline.tiempoEjercicio(day) * 100) / 100;
    }
}

angular.module('starter.controllers')
    .controller('DashCtrl', TimelineController);
