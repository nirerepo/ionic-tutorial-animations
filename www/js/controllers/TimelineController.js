function TimelineController($scope, $ionicActionSheet, Timeline, $rootScope, $ionicNavBarDelegate){
    // Cada vez que se muestra el Timeline le solicitamos al servicio
    // la información actualizada.
    $scope.$on("$ionicView.beforeEnter", function () {
       var hoy = moment().format('YYYYMMDD');
       // Decoramos el timeline con una clase en función del día
       $scope.timelineDays = _(Timeline.get()).map(function(v) {
        v.timelineClass = (hoy==v.day?'today':'pastday');
        return v;
       }).value();
    });


    $scope.cards = [
        {},
        {}
    ];
    $scope.pageTitle = "Hoy";
    $scope.day = function(){
        
    };

    $scope.data = {
        sliderOptions: {
            initialSlide: Timeline.daysToFetch -1
        }
    };

    var self = this;
    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
        if(data.slider.activeIndex == Timeline.daysToFetch -1)
            $ionicNavBarDelegate.title("Hoy");
        else if(data.slider.activeIndex == Timeline.daysToFetch -2)
            $ionicNavBarDelegate.title("Ayer");
        else 
            $ionicNavBarDelegate.title(moment().subtract(4 - data.slider.activeIndex, 'days').format("DD MMM"));
    });

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function (index) {
        var newCard = $scope.cards.push(newCard);
    };
    $scope.trackBlock = function(mealId, day) {
        return !Timeline.trackBlockExists(mealId, day);
    };
    $scope.hasExercises = function(day) {
        return Timeline.hasExercises(day);
    };
    $scope.calcularTotalCalorias = function(mealId, day) {
        return Math.round(Timeline.calcularTotalCalorias(mealId, day));
    };
    $scope.caloriasConsumidas = function(day) {
        return Math.round(Timeline.caloriasConsumidas(day));
    };

    $scope.tiempoEjercicio = function(day) {
        return Math.round(Timeline.tiempoEjercicio(day) * 100) / 100;
    };
}

angular.module('nire.controllers')
    .controller('DashCtrl', TimelineController);
