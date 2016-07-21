function FoodService($q, $http, Connection) {
    this.plateByName = function(queryText) {
        var rdo = $q.defer();
        var query = "http://nire0.gailen.es:9200/platos_es_co/_search?q=nombredieta:" + queryText + "&fields=id,nombredieta,kcal,unidad,cantidad,tipo_item,medida_casera,cantidad_medida_casera,grupo,saludable,grasa,proteina,hc,tipoitem&sort=_score:desc,relevancia:asc";
        $http.get(query)
            .then(function (res) {
            rdo.resolve(res);
        }).catch(function (data, status) {
            console.error('Gists error', response.status, response.data);
        })
            .finally(function () {
        });
        return rdo.promise;
    };

    this.addPlate = function(mealId, plate, date, amount, unidadSeleccionada) {
        var data = { date: date, plate: plate, idMeal: parseInt(mealId), amount: parseInt(amount), unidadSeleccionada: unidadSeleccionada }
        return Connection.request("track/nutrition/addPlate", data, "application/json");
    }

    this.getLastUsed = function(mealId) {
        return Connection.request("newTrack/nutrition/" + mealId + "/newTrackNutrition.json");
    }
}

angular.module('nire.services')
    .service('Food', FoodService);
