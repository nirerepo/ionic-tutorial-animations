/// <reference path="../../typings/index.d.ts" />
function TimelineService(Connection, $filter) {
    var self = this;
    this.tracks = {
        nutrition: [],
        exercises:[]
    };

    this.mealKey = {
        1: "desayuno",
        2: "mediamanana",
        3: "comida",
        4: "merienda",
        5: "cena"
    }

    this.get = function () {
        if(self.tracks.nutrition.length === 0 && self.tracks.exercises.length === 0){
            var date = moment()
            Connection.request("timeline/" + date.format("YYYYMMDD"))
                .then(function(result){
                    result.data.data.body.nutrition.forEach(function(item){
                        self.tracks.nutrition.push(item);
                    })
                    result.data.data.body.physicalActivity.forEach(function(item){
                        self.tracks.exercises.push(item);
                    })
                });
        }
        return self.tracks;
    }

    this.addPlate = function (mealId, plateData){
        var key = self.mealKey[mealId]
        var plate = {completed: true, id: plateData.id, quantity: plateData.kcal + " kcal", title: plateData.name}

        var track = $filter('filter')(self.tracks.nutrition, {typeId: parseInt(mealId)}, true);
        if(track.length === 0) {
            track.push({ type: key, typeId: parseInt(mealId), items: [] });
            self.tracks.nutrition.push( track[0] );
        }

        track[0].items.push(plate)
    }

    this.addExercise = function (exerciseData){
        var exercise = {
            completed: true, 
            id: exerciseData.id, 
            gastoCalorico: Math.round((exerciseData.mets / 60) * 70 * exerciseData.tiempo * 100)/100, 
            title: exerciseData.name,
            tiempo: exerciseData.tiempo
        }

        self.tracks.exercises.push( exercise );
        console.log(self.tracks.exercises)
    }

    this.trackBlockExists = function(mealId){
        var track = $filter('filter')(self.tracks.nutrition, {typeId: mealId}, true);
        if(track.length === 0)
            return false;
        return true;
    }

    this.calcularTotalCalorias = function(mealId){
        var track = $filter('filter')(self.tracks.nutrition, {typeId: parseInt(mealId)}, true)[0];
        var calorias = 0;
        track.items.forEach(function(item){ calorias += parseFloat(item.quantity.split(' ')[0]); });
        return calorias
    }

    this.caloriasConsumidas = function() {
        var calorias = 0;
        self.tracks.exercises.forEach(function(item){calorias += parseFloat(item.gastoCalorico)});
        return calorias;
    }

    this.tiempoEjercicio = function() {
        var tiempo = 0;
        self.tracks.exercises.forEach(function(item){tiempo += parseFloat(item.tiempo)});
        return tiempo;
    }

    this.eliminarPlato = function(plato, mealType){
        var day = moment().format("YYYYMMDD")
        var data = { date: day, idMeal: mealType, idTrack: plato.id }
        Connection.request("track/nutrition/delete", data).then(function(){
            var track = $filter('filter')(self.tracks.nutrition, {type: mealType}, true)[0];
            track.items.splice(track.items.indexOf(plato), 1);
            if(track.items.length === 0)
                self.tracks.nutrition.splice(self.tracks.nutrition.indexOf(track));
        })
    }

    this.eliminarEjercicio = function(exercise) {
        var day = moment().format("YYYYMMDD")
        var data = { date: day, idTrack: exercise.id }
        Connection.request("track/physicalActivity/delete", data).then(function(){
            self.tracks.exercises.splice(self.tracks.exercises.indexOf(exercise), 1);
        })
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);