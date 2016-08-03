function ReviewController($scope, $stateParams, DailyReview, $ionicNavBarDelegate, $ionicHistory, serverConfig) {
    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.$on("$ionicView.beforeEnter", function () {
        DailyReview.get($stateParams.day).then(function(response) {
            $scope.data = response.data.data;
            console.log(serverConfig);
            $scope.reviewHeader = serverConfig.reader + 'widgets/dailyReview.htm';
            $scope.reviewKcal = serverConfig.reader + 'widgets/dailyCalories.htm';
            $scope.reviewMacro= serverConfig.reader + 'widgets/dailyNutrients.htm';
        });
    });
}

angular.module('nire.controllers')
    .controller('ReviewCtrl', ReviewController);
