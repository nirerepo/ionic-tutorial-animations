function FoodController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Food, Timeline, $filter, $analytics) {
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

    $scope.clearOrClose = function() {
        if ($scope.data.search == '')
            $scope.goBack();
        else
            $scope.clear();
    }
    $scope.search = function() {
        if ($scope.data.search.length >= 2) {
            Food.plateByName($scope.data.search).then(function(matches) {
                $scope.data.plates = matches.data.hits.hits;
            });
            $analytics.eventTrack('food_search', { category: "plate", eventType: "search"});
        }
        else
            $scope.data.plates = [];

    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };


    var savePlate = function(plateData, amount, unidadSeleccionada, unidadCantidad) {
        var mealId = $stateParams.mealId;
        var date = $stateParams.day;

        Food.addPlate(mealId, plateData, date, amount, unidadSeleccionada).then(function(result){
            Timeline.updatePlateKcal(mealId, plateData.id, date, result.data.data);    
        })
        Timeline.addPlate(mealId, plateData, date, amount, unidadSeleccionada, unidadCantidad);
        $state.go("tab.dash");
    }

    $scope.calcularCalorias = function(calorias, medidaCasera) {
        if(!medidaCasera) return $filter('number')(calorias, 0)
        return $filter('number')(medidaCasera * calorias / 100, 0)
    }

    $scope.foodTracker = {
        addPlate : function(plate) {
            var fields = plate.fields;
            console.log(fields)
            var plateData = {id: fields.id[0],
                            name: fields.nombredieta[0],
                            kcal: fields.kcal? fields.kcal[0] : 0,
                            cantidad: fields.cantidad? fields.cantidad[0]:null,
                            medida_casera: [],//fields.medida_casera? fields.medida_casera[0]:null,
                            //cantidad_medida_casera: fields.cantidad_medida_casera? fields.cantidad_medida_casera[0]:null,
                            grupo: fields.grupo? fields.grupo[0]:null,
                            grasa: fields.grasa? fields.grasa[0]:null,
                            proteina: fields.proteina? fields.proteina[0]:null,
                            hc: fields.hc? fields.hc[0]:null,
                            tipoitem: fields.tipoitem? fields.tipoitem[0]:null,
                            unidad: fields.unidad? fields.unidad[0]:null
                            };
            //$scope.data.unidades = plateData.medida_casera
            //console.log("unidades", $scope.data.unidades)
            $scope.data.measures = [];
            $scope.data.measuresAmount = [];
            if(fields.medida_casera){
                for(var i = 0; i < fields.medida_casera.length; i++) {
                    plateData.medida_casera.push({medida_casera: fields.medida_casera[i], cantidad_medida_casera: fields.cantidad_medida_casera[i]});
                    $scope.data.measures.push(fields.medida_casera[i]);
                    $scope.data.measuresAmount[fields.medida_casera[i]] = fields.cantidad_medida_casera[i];
                }
            }
            
            if($scope.data.measures.length == 0) {
                $scope.data.measures.push('Racion');
                $scope.data.measuresAmount['Racion'] = 100;
            }
            
            $scope.data.measures.push(plateData.unidad);
            
            $scope.data.unidadSeleccionada = $scope.data.measures[0]
            $scope.data.foodAmounts[$scope.data.unidadSeleccionada] = 1;
            $scope.data.selectedFood = plateData;
            
            this.updateEquivalences();
            $scope.foodTrackModal.show();
        },
        addFrecuentPlate : function(plate) {
            var plateData = {name: plate.title, kcal: plate.calories, id: plate.id, medida_casera: plate.medida_casera, cantidad_medida_casera: plate.cantidad_medida_casera};
            $scope.data.unidadSeleccionada = _(plateData.medida_casera).upperFirst() || 'Ración';
            $scope.data.measures = [$scope.data.unidadSeleccionada, 'Gramos'];
            $scope.data.foodAmounts[$scope.data.unidadSeleccionada] = 1;
            $scope.data.selectedFood = plateData;
            this.updateEquivalences();
            $scope.foodTrackModal.show();
        },
        saveDetails : function() {
            $scope.foodTrackModal.hide();
            savePlate($scope.data.selectedFood, $scope.data.foodAmounts[$scope.data.selectedFood.unidad], $scope.data.unidadSeleccionada, $scope.data.foodAmounts[$scope.data.unidadSeleccionada]);
          },
        closeFoodDetails : function() {
            $scope.foodTrackModal.hide();
        },
        increaseAmount: function() {
            $scope.data.foodAmounts[$scope.data.unidadSeleccionada] += 1;
            this.updateEquivalences();
        },
        decreaseAmount: function() {
            if ($scope.data.foodAmounts[$scope.data.unidadSeleccionada] > 1)
                $scope.data.foodAmounts[$scope.data.unidadSeleccionada] -= 1;
            this.updateEquivalences();
        },
        keepOnlyNumbers: function() {
            $scope.data.foodAmounts[$scope.data.unidadSeleccionada] = $scope.data.foodAmounts[$scope.data.unidadSeleccionada].replace(/\D/, '');
            this.updateEquivalences();
        },
        updateEquivalences: function() {
            _($scope.data.measures).each(function(m) {
                if (m == $scope.data.selectedFood.unidad && $scope.data.unidadSeleccionada != $scope.data.selectedFood.unidad) {
                    $scope.data.foodAmounts[m] = $scope.data.foodAmounts[$scope.data.unidadSeleccionada] * $scope.data.measuresAmount[$scope.data.unidadSeleccionada];
                }else if(m != $scope.data.unidadSeleccionada){
                    $scope.data.foodAmounts[m] = Math.round($scope.data.foodAmounts[$scope.data.unidadSeleccionada] / $scope.data.measuresAmount[m]*2)/2;
                }
            });
        },
        selectUnit: function(unit) {
            $scope.data.unidadSeleccionada = unit;
            this.updateEquivalences();
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
