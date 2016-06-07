/// <reference path="../../typings/index.d.ts" />
function TimelineService(Connection) {
    var self = this;
    this.tracks = [];

    this.get = function () {
        var date = moment()
        Connection.request("timeline/" + date.format("YYYYMMDD"))
            .then(function(result){
                self.tracks = result.data.data.body.nutrition
            });
    }

    this.addPlate = function (mealId, plateData){
        
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);
