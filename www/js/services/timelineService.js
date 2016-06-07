/// <reference path="../../typings/index.d.ts" />
function TimelineService(Connection) {
    this.get = function () {
        var date = moment()
        return Connection.request("timeline/" + date.format("YYYYMMDD"));
    }
}

angular.module('starter.services')
    .service('Timeline', TimelineService);
