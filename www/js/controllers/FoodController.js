function FoodController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Food, Timeline) {
    $scope.data = {
        "plates": [],
        "search": '',
        "selectedFood": null,
        "foodAmount": 1
    };
    $scope.$on('$ionicView.enter', function() {
    });
    $scope.$on("$ionicView.beforeEnter", function () {
       $scope.clear();
       $scope.data.search = '';
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


    var savePlate = function(plateData, amount) {
        var mealId = $stateParams.mealId;
        var date = $stateParams.day;
        Food.addPlate(mealId, plateData, date, amount).then(function(result){
            Timeline.updatePlateKcal(mealId, plateData.id, date, result.data.data);    
        })
        Timeline.addPlate(mealId, plateData, date);
        $state.go("tab.dash");
    }

    $scope.foodTracker = {
        addPlate : function(plate) {
            var fields = plate.fields;
            var plateData = {id: fields.id[0],
                            name: fields.nombredieta[0],
                            kcal: fields.kcal? fields.kcal[0] : 0,
                            cantidad: fields.cantidad? fields.cantidad[0]:null,
                            medida_casera: fields.medida_casera? fields.medida_casera[0]:null,
                            cantidad_medida_casera: fields.cantidad_medida_casera? fields.cantidad_medida_casera[0]:null,
                            grupo: fields.grupo? fields.grupo[0]:null
                            };
            $scope.data.selectedFood = plateData;
            $scope.data.unidades = _(plateData.medida_casera).upperFirst();
            $scope.foodTrackModal.show();
        },
        addFrecuentPlate : function(plate) {
            var plateData = {name: plate.title, kcal: plate.calories, id: plate.id};
            $scope.data.unidades = _(plate.medida_casera).upperFirst();
            $scope.data.selectedFood = plateData;
            $scope.foodTrackModal.show();
        },
        saveDetails : function() {
            $scope.foodTrackModal.hide();
            savePlate($scope.data.selectedFood, $scope.data.foodAmount);
          },
        closeFoodDetails : function() {
            $scope.foodTrackModal.hide();
        },
        increaseAmount: function() {
            $scope.data.foodAmount += 1;

        },
        decreaseAmount: function() {
            if ($scope.data.foodAmount > 1)
                $scope.data.foodAmount -= 1;
        },
        keepOnlyNumbers: function() {
            $scope.data.foodAmount = $scope.data.foodAmount.replace(/\D/, '');
        }
    }

    $ionicModal.fromTemplateUrl('templates/food/track-details.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: false
    }).then(function(modal) {
        $scope.foodTrackModal = modal;
    });

}

angular.module('nire.controllers')
    .controller('FoodCtrl', FoodController);
