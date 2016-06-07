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
        var date = moment()
        Connection.request("timeline/" + date.format("YYYYMMDD"))
            .then(function(result){
                result.data.data.body.nutrition.forEach(function(item){
                    self.tracks.push(item);
                })
            });
        return self.tracks;
    }

    this.addPlate = function (mealId, plateData){
        var key = self.mealKey[mealId]
        var plate = {completed: true, id: plateData.id, quantity: plateData.kcal + " kcal", title: plateData.name}

        var track = $filter('filter')(self.tracks, {type: key}, true);
        if(track.length === 0) {
            track.push({ type: key, items: [] });
            self.tracks.push( track[0] );
        }

        track[0].items.push(plate)
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);

/*
[
    { completed: "true", id:"1377", isUserAdded: true, percent:"0%", quantity:"295 kcal", title:"Caldo de costilla con patatas"}
]
type:"comida"
*/