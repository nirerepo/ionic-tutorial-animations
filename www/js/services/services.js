angular.module('nire.services', [])
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
