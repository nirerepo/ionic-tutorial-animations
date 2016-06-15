function FoodController($scope, $state, $stateParams, $ionicHistory, Food, Timeline) {
    $scope.data = {
        "plates": [],
        "search": ''
    };
    $scope.$on('$ionicView.enter', function() {
        $scope.data.search = '';
    });
    $scope.$on("$ionicView.beforeEnter", function () {
       Food.getLastUsed().then(function(result){
            $scope.lastUsed = result.data.data.body.most_used
       });
    });

    $scope.clear = function() {
        $scope.data.search = '';
        $scope.data.plates = [];
    }
    $scope.search = function() {
        if ($scope.data.search.length >= 3)
            Food.plateByName($scope.data.search).then(function(matches) {
                $scope.data.plates = matches.data.hits.hits;
            });
        else
            $scope.data.plates = [];

    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };
    $scope.addPlate = function(plate) {
        var fields = plate.fields;
        var plateData = {name: fields.nombredieta[0], kcal: fields.kcal? fields.kcal[0] : 0, id: fields.id[0]}
        savePlate(plateData);
    }

    $scope.addFrecuentPlate = function(plate) {
        var plateData = {name: plate.title, kcal: plate.calories, id: plate.id};
        savePlate(plateData);
    }

    var savePlate = function(plateData) {
        var mealId = $stateParams.mealId;
        var date = $stateParams.day;
        Food.addPlate(mealId, plateData, date).then(function(result){
            Timeline.addPlate(mealId, plateData, date);
            $state.go("tab.dash");
        })
    }
}

angular.module('nire.controllers')
    .controller('FoodCtrl', FoodController);
