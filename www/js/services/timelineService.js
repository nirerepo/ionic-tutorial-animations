/// <reference path="../../typings/index.d.ts" />
function TimelineService(Connection, $filter) {
    var self = this;
    this.daysToFetch = 5;
    this.tracks = {};

    this.mealKey = {
        1: "desayuno",
        2: "mediamanana",
        3: "comida",
        4: "merienda",
        5: "cena"
    }

    this.get = function () {
        for(var i = 0; i < self.daysToFetch; i++ ){
            var date = moment().subtract(i, 'days').format("YYYYMMDD");
            if(!self.tracks[date]){
                self.tracks[date] = {
                    day: date,
                    nutrition: [],
                    exercises: []
                }
                Connection.request("timeline/" + date)
                    .then(
                        function(date, result){
                            result.data.data.body.nutrition.forEach(function(item){
                                self.tracks[date].nutrition.push(item);
                            })
                            result.data.data.body.physicalActivity.forEach(function(item){
                                self.tracks[date].exercises.push(item);
                            })
                        }.bind(this, date)
                    );
            }
        }
        return self.tracks;
    }

    this.addPlate = function (mealId, plateData, day){
        var key = self.mealKey[mealId]
        var plate = {completed: true, id: plateData.id, quantity: Math.floor(plateData.kcal) + " kcal", title: plateData.name}

        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: parseInt(mealId)}, true);
        if(track.length === 0) {
            track.push({ type: key, typeId: parseInt(mealId), items: [] });
            self.tracks[day].nutrition.push( track[0] );
        }

        track[0].items.push(plate)
    }

    this.addExercise = function (exerciseData, day){
        var exercise = {
            completed: true, 
            id: exerciseData.id, 
            gastoCalorico: Math.floor((exerciseData.mets / 60) * 70 * exerciseData.tiempo), 
            title: exerciseData.name,
            tiempo: exerciseData.tiempo
        }

        self.tracks[day].exercises.push( exercise );
    }

    this.trackBlockExists = function(mealId, day){
        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: mealId}, true);
        if(track.length === 0)
            return false;
        return true;
    }

    this.calcularTotalCalorias = function(mealId, day){
        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: parseInt(mealId)}, true)[0];
        var calorias = 0;
        track.items.forEach(function(item){ calorias += parseFloat(item.quantity.split(' ')[0]); });
        return calorias
    }

    this.caloriasConsumidas = function(day) {
        var calorias = 0;
        self.tracks[day].exercises.forEach(function(item){calorias += parseFloat(item.gastoCalorico)});
        return calorias;
    }

    this.tiempoEjercicio = function(day) {
        var tiempo = 0;
        self.tracks[day].exercises.forEach(function(item){tiempo += parseFloat(item.tiempo)});
        return tiempo;
    }

    this.hasExercises = function(day) {
        return self.tracks[day].exercises.length > 0;
    }

    this.eliminarPlato = function(plato, mealType, day){
        var data = { date: day, idMeal: mealType, idTrack: plato.id }
        Connection.request("track/nutrition/delete", data).then(function(){
            var track = $filter('filter')(self.tracks[day].nutrition, {type: mealType}, true)[0];
            track.items.splice(track.items.indexOf(plato), 1);
            if(track.items.length === 0)
                self.tracks[day].nutrition.splice(self.tracks[day].nutrition.indexOf(track), 1);
        })
    }

    this.eliminarEjercicio = function(exercise, day) {
        var data = { date: day, idTrack: exercise.id }
        Connection.request("track/physicalActivity/delete", data).then(function(){
            self.tracks[day].exercises.splice(self.tracks[day].exercises.indexOf(exercise), 1);
        })
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);