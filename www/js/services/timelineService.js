/// <reference path="../../typings/index.d.ts" />
angular.module('starter.services')
    .factory('Timeline', function (Connection) {
    return {
        init: function ($scope, $sliderDelegate) {
            var setupSlider = function () {
                //some options to pass to our slider
                $scope.data.sliderOptions = {
                    initialSlide: $scope.data.currentPage,
                    direction: 'horizontal',
                    speed: 250,
                    shortSwipes: false
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
        },
        get: function () {
            var date = moment()
            return Connection.request("timeline/" + date.format("YYYYMMDD"));
        }
    };
});
