function ReviewController($scope, $stateParams, DailyReview, $ionicNavBarDelegate, $ionicHistory) {
    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.$on("$ionicView.beforeEnter", function () {
        DailyReview.get($stateParams.day).then(function(response) {
            $scope.data = response.data.data; 
        });
    });
}

angular.module('nire.controllers')
    .controller('ReviewCtrl', ReviewController);
