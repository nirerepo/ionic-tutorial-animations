function FoodService($q, $http, Connection) {
    this.plateByName = function(queryText) {
        var rdo = $q.defer();
        var query = "http://search.nire.co/platos_es_co/_search?q=nombredieta:*" + queryText + "**&fields=id,nombredieta,kcal&sort=_score:asc";
        $http.get(query)
            .then(function (res) {
            console.log("RES: ", res);
            rdo.resolve(res);
        }).catch(function (data, status) {
            console.error('Gists error', response.status, response.data);
        })
            .finally(function () {
            console.log("finally finished gists");
        });
        return rdo.promise;
    };

    this.addPlate = function(mealId, plate) {
        var date = moment().format("YYYYMMDD")
        var data = { date: date, plates: [plate], idMeal: parseInt(mealId) }
        return Connection.request("track/nutrition/add", data, "application/json");
    }
}

angular.module('starter.services')
    .service('Food', FoodService);