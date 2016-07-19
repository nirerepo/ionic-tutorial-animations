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

    this.get = function (force) {
        force = ((typeof force !== 'undefined') ? force : false);
        for(var i = 0; i < self.daysToFetch; i++ ){
            var date = moment().subtract(i, 'days').format("YYYYMMDD");
            if(force || !self.tracks[date]
                || !self.tracks[date].nutrition
                || !self.tracks[date].exercises
                || !self.tracks[date].challenges) {
                if (!self.tracks[date])
                    self.tracks[date] = {
                        day: date,
                        nutrition: null,
                        exercises: null,
                        challenges: null
                    }
                Connection.request("timeline/" + date)
                    .then(
                        function(date, result){
                            var tmpNutri = [];
                            result.data.data.body.nutrition.forEach(function(item){
                                tmpNutri.push(item);
                            });
                            self.tracks[date].nutrition = tmpNutri;
                            var tmpPhysi = [];
                            result.data.data.body.physicalActivity.forEach(function(item){
                                tmpPhysi.push(item);
                            });
                            self.tracks[date].exercises = tmpPhysi;
                            var tmpChalle = [];
                            result.data.data.body.challenges.forEach(function(item){
                                if (item.areaId == 'nutrition')
                                    item.background = "img/others/cards/challenges/fruit.jpg";
                                else if (item.areaId == 'activity')
                                    item.background = "img/others/cards/challenges/activity.jpg";
                                else
                                    item.background = "img/others/cards/challenges/fruit.jpg";

                                tmpChalle.push(item);
                            });
                            self.tracks[date].challenges = tmpChalle;
                            //console.log("CHALLENGES: ", date, self.tracks[date].challenges);
                        }.bind(this, date)
                    );
            }
        }
        console.log("Timeline", self.tracks);
        return self.tracks;
    }

    this.addPlate = function (mealId, plateData, day, amount){
        var key = self.mealKey[mealId]
        var plate = {
            id: plateData.id, 
            title: plateData.name, 
            userAmount: amount + " " + plateData.medida_casera,
            gramos: (plateData.cantidad_medida_casera? plateData.cantidad_medida_casera : 100) * amount
        }

        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: parseInt(mealId)}, true);
        if(track.length === 0) {
            track.push({ type: key, typeId: parseInt(mealId), items: [] });
            self.tracks[day].nutrition.push( track[0] );
            // Ordeno las comidas por si el elemento que se agrego no va ultimo
            self.tracks[day].nutrition.sort(function(a, b){
                return a.typeId - b.typeId
            })
        }
        if($filter('filter')(track[0].items, {id: plate.id}, true) == 0)
            track[0].items.push(plate)
    }

    this.updatePlateKcal = function(mealId, plateId, day, data) {
        //quantity
        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: parseInt(mealId)}, true)[0];
        var meal = $filter('filter')(track.items, {id: plateId}, true)[0];
        meal.quantity = data.kcal + " kcal";
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
        if(!track || track.length === 0)
            return false;
        return true;
    }

    this.calcularTotalCalorias = function(mealId, day){
        var track = $filter('filter')(self.tracks[day].nutrition, {typeId: parseInt(mealId)}, true)[0];
        if(track) {
            var calorias = 0;
            track.items.forEach(function(item) { 
                if(item.quantity)
                    calorias += parseFloat(item.quantity.split(' ')[0]); 
            });
            return calorias;
        } return 0;
    }

    this.caloriasConsumidas = function(day) {
        var calorias = 0;
        _(self.tracks[day].exercises).forEach(function(item){calorias += parseFloat(item.gastoCalorico)});
        return calorias;
    }

    this.tiempoEjercicio = function(day) {
        var tiempo = 0;
        _(self.tracks[day].exercises).forEach(function(item){tiempo += parseFloat(item.tiempo)});
        return tiempo;
    }

    this.hasExercises = function(day) {
        return _(self.tracks[day].exercises).size() > 0;
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

    this.incrWater = function(day) {
        var data = { a: 1 };
        return Connection.request("track/counter/water/"+day+"/incr", data).then(function(ret){
            console.log("INCR", ret);
            return ret;
        })
    }

    this.decrWater = function(day) {
        var data = { a: 1 };
        return Connection.request("track/counter/water/"+day+"/decr", data).then(function(ret){
            console.log("DECR", ret);
            return ret;
        })
    }
}

angular.module('nire.services')
    .service('Timeline', TimelineService);
