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

    /**
     * Saber si se esta realizando periodicamente la llamada al monitor
     * @return {boolean} True si se esta llamando, false en caso contrario
     */
    this.isEnabled = function() {
        return !!intervalPromise;
    }

    this.start = function() {
        if(!this.isEnabled()) {
            intervalPromise = $interval(intervalFunction, delay);
            console.log("Iniciando Monitor Interval");
        }
    };

    this.stop = function() {
        if(this.isEnabled()) {
            $interval.cancel(intervalPromise);
            console.log("Deteniendo Monitor Interval");
        }
        intervalPromise = null;
    };
}

angular.module("nire.services")
    .service("Monitor", MonitorService);
