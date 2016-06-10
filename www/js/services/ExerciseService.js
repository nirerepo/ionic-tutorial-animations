function ExerciseService($q, $http, Connection) {
    this.exerciseByName = function(queryText) {
        var rdo = $q.defer();
        var query = "http://nire0.gailen.es:9200/ejercicios_es_co/_search?q=nombre:" + queryText + "&fields=id,nombre,mets,tipo,gruposmusculares&sort=_score:desc";
        $http.get(query)
            .then(function (res) {
            console.log("RES: ", res);
            rdo.resolve(res);
        }).catch(function (data, status) {
            console.error('Gists error', status, data);
        })
            .finally(function () {
            console.log("finally finished gists");
        });
        return rdo.promise;
    };

    this.add = function(exercise) {
        var date = moment().format("YYYYMMDD")
        var data = { date: date, exercise: exercise, time: exercise.time }
        console.log("DATA", data);
        return Connection.request("track/physicalActivity/new", data, "application/json");
    }

    this.type = {
        '1': 'Fuerza',
        '2': 'Calistenico',
        '3': 'Estiramiento',
        '4': 'Equilibrio',
        '5': 'Cardiovascular',
        '6': 'Calentamiento',
        '7': 'Isometrico'
    }
}

angular.module('starter.services')
    .service('Exercise', ExerciseService);
