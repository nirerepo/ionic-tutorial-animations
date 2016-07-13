/// <reference path="../../typings/index.d.ts" />
function DailyReviewService(Connection, $filter) {
    var self = this;

    this.get = function (date) {
        var data = null;
        return Connection.request('nutrition/'+date+'/nutritionWeekly.json')
            .then(function(d) {
                console.log("D", d);
                return self.buildData(d.data.data.body);
            });
    }

    this.buildData = function(raw) {
        var hc = _(raw.indicators).find(function(o) {
                return o.type == 'hc';
            });
        var pt = _(raw.indicators).find(function(o) {
                return o.type == 'prot';
            });
        var lp = _(raw.indicators).find(function(o) {
                return o.type == 'grasa';
            });
        raw.macros = { hc: {}, pt: {}, lp: {}};
        raw.macros.hc.target = parseInt(raw.quantity*0.55/4);
        raw.macros.hc.current = parseInt(hc.quantity);
        raw.macros.pt.target = parseInt(raw.quantity*0.175/4);
        raw.macros.pt.current = parseInt(pt.quantity);
        raw.macros.lp.target = parseInt(raw.quantity*0.325/9);
        raw.macros.lp.current = parseInt(lp.quantity);
        console.log("RAW", raw);
        return raw;
    }
}
angular.module('nire.services')
    .service('DailyReview', DailyReviewService);
