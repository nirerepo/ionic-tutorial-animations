function DailyReviewService(Connection) {
    var self = this;

    this.get = function (date) {
        return Connection.request("review/daily", { date: date });
    };
}

angular.module('nire.services')
    .service('DailyReview', DailyReviewService);
