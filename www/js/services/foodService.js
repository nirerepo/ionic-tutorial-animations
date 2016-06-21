function FoodService($q, $http, Connection) {
    this.plateByName = function(queryText) {
        var rdo = $q.defer();
        var query = "http://nire0.gailen.es:9200/platos_es_co/_search?q=nombredieta:" + queryText + "&fields=id,nombredieta,kcal,cantidad,tipo_item,medida_casera,cantidad_medida_casera,grupo&sort=_score:desc";
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

    this.addPlate = function(mealId, plate, date) {
        var data = { date: date, plates: [plate], idMeal: parseInt(mealId) }
        return Connection.request("track/nutrition/add", data, "application/json");
    }

    this.getLastUsed = function() {
        return Connection.request("newTrack/nutrition/id/newTrackNutrition.json");
    }
}

angular.module('nire.services')
    .service('Food', FoodService);
