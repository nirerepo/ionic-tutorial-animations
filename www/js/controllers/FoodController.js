function FoodController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Food, Timeline) {
    $scope.data = {
        "plates": [],
        "search": '',
        "selectedFood": null,
        "foodAmounts" : {}
    };
    $scope.$on('$ionicView.enter', function() {
    });
    $scope.$on("$ionicView.beforeEnter", function () {
       $scope.clear();
       $scope.data.search = '';
       Food.getLastUsed($stateParams.mealId).then(function(result){
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
        Timeline.addPlate(mealId, plateData, date, amount);
        $state.go("tab.dash");
    }

    $scope.foodTracker = {
        addPlate : function(plate) {
            var fields = plate.fields;
            console.log(fields)
            var plateData = {id: fields.id[0],
                            name: fields.nombredieta[0],
                            kcal: fields.kcal? fields.kcal[0] : 0,
                            cantidad: fields.cantidad? fields.cantidad[0]:null,
                            medida_casera: fields.medida_casera? fields.medida_casera[0]:null,
                            cantidad_medida_casera: fields.cantidad_medida_casera? fields.cantidad_medida_casera[0]:null,
                            grupo: fields.grupo? fields.grupo[0]:null,
                            grasa: fields.grasa? fields.grasa[0]:null,
                            proteina: fields.proteina? fields.proteina[0]:null,
                            hc: fields.hc? fields.hc[0]:null,
                            tipoitem: fields.tipoitem? fields.tipoitem[0]:null
                            };
            $scope.data.measures = [$scope.data.unidades, 'Gramos'];
            $scope.data.foodAmounts[$scope.data.unidades] = 1;
            $scope.data.selectedFood = plateData;
            this.updateEquivalences();
            $scope.foodTrackModal.show();
        },
        addFrecuentPlate : function(plate) {
            var plateData = {name: plate.title, kcal: plate.calories, id: plate.id, medida_casera: plate.medida_casera, cantidad_medida_casera: plate.cantidad_medida_casera};
            $scope.data.unidades = _(plateData.medida_casera).upperFirst() || 'Ración';
            $scope.data.measures = [$scope.data.unidades, 'Gramos'];
            $scope.data.foodAmounts[$scope.data.unidades] = 1;
            $scope.data.selectedFood = plateData;
            this.updateEquivalences();
            $scope.foodTrackModal.show();
        },
        saveDetails : function() {
            $scope.foodTrackModal.hide();
            savePlate($scope.data.selectedFood, $scope.data.foodAmounts[$scope.data.unidades]);
          },
        closeFoodDetails : function() {
            $scope.foodTrackModal.hide();
        },
        increaseAmount: function() {
            $scope.data.foodAmounts[$scope.data.unidades] += 1;
            this.updateEquivalences();
        },
        decreaseAmount: function() {
            if ($scope.data.foodAmounts[$scope.data.unidades] > 1)
                $scope.data.foodAmounts[$scope.data.unidades] -= 1;
            this.updateEquivalences();
        },
        keepOnlyNumbers: function() {
            $scope.data.foodAmounts[$scope.data.unidades] = $scope.data.foodAmounts[$scope.data.unidades].replace(/\D/, '');
            this.updateEquivalences();
        },
        updateEquivalences: function() {
            _($scope.data.measures).each(function(m) {
                if (m != $scope.data.unidades) {
                    console.log($scope.data.selectedFood);
                    $scope.data.foodAmounts[m] = $scope.data.foodAmounts[$scope.data.unidades] * $scope.data.selectedFood.cantidad_medida_casera;
                }
            });
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
