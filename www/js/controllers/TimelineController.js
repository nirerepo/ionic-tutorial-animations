function TimelineController($scope, Timeline, $ionicNavBarDelegate, $analytics, $ionicModal){
    var self = this;

    // Inicialización del slider
    $scope.data = {
        title: '',
        sliderOptions: {
            initialSlide: Timeline.daysToFetch -1
        },
        timelineDays: null
    };

    // Cada vez que se muestra el Timeline le solicitamos al servicio
    // la información actualizada.
    $scope.$on("$ionicView.beforeEnter", function () {
       var hoy = moment().format('YYYYMMDD');
       // Decoramos el timeline con una clase en función del día
       $scope.data.timelineDays = _(Timeline.get()).map(function(v) {
        v.timelineClass = (hoy==v.day?'today':'pastday');
        return v;
       }).value();
    });

    $scope.$on("$ionicView.enter", function() {
        self.updateTitle();
    });

    this.updateTitle = function() {
        if($scope.data.slider.activeIndex == Timeline.daysToFetch -1)
            $scope.data.title = "Hoy";
        else if($scope.data.slider.activeIndex == Timeline.daysToFetch -2)
            $scope.data.title = "Ayer";
        else
            $scope.data.title = moment().subtract(4 - $scope.data.slider.activeIndex, 'days').format("DD MMM");
    }
    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });
    // Cuando cambia el slide actual, actualizamos el título de la ventana
    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
        if (window.analytics)
            $analytics.eventTrack('day_slided', { category: (4 - data.slider.activeIndex) + " days", eventType: "slide"});
        if ($scope.slider)
            self.updateTitle();
    });

    $scope.onReadySwiper = function(swiper){
            swiper.initObservers();
            swiper.on('slideChangeStart', function() {
                console.log("changeStart!");
                console.log($analytics);
                $analytics.eventTrack('widget_changed', {eventType: "slide", category: "challenge"});
            });
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
    $scope.incrWater = function() {
        var date = moment().subtract(4 - $scope.data.slider.activeIndex, 'days').format("YYYYMMDD");
        Timeline.incrWater(date).then(function(count) {
            self.updateDailyWater(date, count.data.data.water);
        });
    }
    $scope.decrWater = function() {
        var date = moment().subtract(4 - $scope.data.slider.activeIndex, 'days').format("YYYYMMDD");
        Timeline.decrWater(date).then(function(count) {
            self.updateDailyWater(date, count.data.data.water);
        });
    }

    this.updateDailyWater = function(date, amount) {
        _.find(_.find($scope.data.timelineDays, function(o) { return (o.day === date);}).challenges, function(c) { return c.type == "water"; }).current = amount;
    }

    $scope.showMealreview = function(date, mealId) {
        $scope.mealReview = {}
        Timeline.getMealReview(date, mealId).then(function(data) {
            console.log(data)
            $scope.mealReview.meal = data.data.data.review.title;
            $scope.mealReview.currentKcal = data.data.data.review.kcal.current;
            $scope.mealReview.targetKcal = data.data.data.review.kcal.target;
            console.log($scope.mealReview)
            $scope.mealReviewModal.show();
        });
    }

    $scope.closeMealReview = function() {
        $scope.mealReviewModal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/content/diet-meal-review.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: false
    }).then(function(modal) {
        $scope.mealReviewModal = modal;
    });
}

angular.module('nire.controllers')
    .controller('DashCtrl', TimelineController);
