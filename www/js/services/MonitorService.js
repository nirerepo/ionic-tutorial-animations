/**
 * Consulta periodicamente al servidor en busca de notificaciones u otras operaciones.
 * @param {angular.IIntervalService} $interval
 */
function MonitorService(Connection, $interval, messagingService, Timeline, $localStorage) {
    /** @type number */
    var delay = 5000;

    /** @type ng.IPromise<any> */
    var intervalPromise = null;
    var userSerial = $localStorage.userSerial?$localStorage.userSerial:0;

    function intervalFunction() {
        Connection.request("notification/pending", { id: messagingService.getLastMessage() })
            .then(function(response) {
                response.data.data.notifications.forEach(function(element) {
                    messagingService.receive(element);
                }, this);
                if (response.data.meta.serial > userSerial) {
                    console.log("REFRESH!!");
                    Timeline.get(true);
                    userSerial = response.data.meta.serial;
                    $localStorage.userSerial = userSerial;
                }

                //console.log(response);
                messagingService.receiveReply(response.data.data.responses)
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
