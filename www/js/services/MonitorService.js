/**
 * Consulta periodicamente al servidor en busca de notificaciones u otras operaciones.
 * @param {angular.IIntervalService} $interval
 */
function MonitorService(Connection, $interval, messagingService) {
    /** @type number */
    var delay = 5000;

    /** @type ng.IPromise<any> */
    var intervalPromise = null;

    function intervalFunction() {
        Connection.request("notification/pending", { id: messagingService.getLastMessage() })
            .then(function(response) {
                response.data.data.notifications.forEach(function(element) {
                    messagingService.receive(element);
                }, this);
            });
            
    }

    this.start = function() {
        if(!intervalPromise) {
            intervalPromise = $interval(intervalFunction, delay);
            console.log("Iniciando Monitor Interval");
        }
    };

    this.stop = function() {
        if(intervalPromise) {
            $interval.cancel(intervalPromise);
            console.log("Deteniendo Monitor Interval");
        }
        intervalPromise = null;
    };
}

angular.module("nire.services")
    .service("Monitor", MonitorService);
