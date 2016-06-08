/// <reference path="../../typings/index.d.ts" />
function TimelineService(Connection, $filter) {
    var self = this;
    this.tracks = [];

    this.mealKey = {
        1: "desayuno",
        2: "mediamanana",
        3: "comida",
        4: "merienda",
        5: "cena"
    }

    this.get = function () {
        if(self.tracks.length === 0){
            var date = moment()
            Connection.request("timeline/" + date.format("YYYYMMDD"))
                .then(function(result){
                    result.data.data.body.nutrition.forEach(function(item){
                        self.tracks.push(item);
                    })
                });
        }
        return self.tracks;
    }

    this.addPlate = function (mealId, plateData){
        var key = self.mealKey[mealId]
        var plate = {completed: true, id: plateData.id, quantity: plateData.kcal + " kcal", title: plateData.name}

        var track = $filter('filter')(self.tracks, {typeId: parseInt(mealId)}, true);
        if(track.length === 0) {
            track.push({ type: key, typeId: parseInt(mealId), items: [] });
            self.tracks.push( track[0] );
        }

        track[0].items.push(plate)
    }

    this.trackBlockExists = function(mealId){
        var track = $filter('filter')(self.tracks, {typeId: mealId}, true);
        if(track.length === 0)
            return false;
        return true;
    }

    this.calcularTotalCalorias = function(mealId){
        var track = $filter('filter')(self.tracks, {typeId: parseInt(mealId)}, true)[0];
        var calorias = 0;
        track.items.forEach(function(item){ calorias += parseFloat(item.quantity.split(' ')[0]); });
        return calorias
    }

    this.eliminarPlato = function(plato, mealType){
        var day = moment().format("YYYYMMDD")
        var data = { date: day, idMeal: mealType, idTrack: plato.id }
        Connection.request("track/nutrition/delete", data).then(function(){
            var track = $filter('filter')(self.tracks, {type: mealType}, true)[0];
            track.items.splice(track.items.indexOf(plato), 1);
            if(track.items.length === 0)
                self.tracks.splice(track);
        })
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);