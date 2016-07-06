/**
 * Consulta periodicamente al servidor en busca de notificaciones u otras operaciones.
 * @param {angular.IIntervalService} $interval
 */
function MonitorService(Connection, $interval, messagingService, Timeline, $localStorage, HealthStore, $ionicPlatform, push) {
    /** @type number */
    var delay = 5000;

    /** @type ng.IPromise<any> */
    var intervalPromise = null;
    var userSerial = $localStorage.userSerial?$localStorage.userSerial:0;

    this.pushToken = "This is the push token in a device.";
    
    $ionicPlatform.ready(function() {
        // Cuando se instancia este controller, aprovechamos para inicializar
        // las notificaciones push
        push.init().then(function(value) { 
            this.pushToken = value; 
            console.log(this.pushToken)
            Connection.request("registry/device", { deviceToken: value, platform: device.platform, deviceId: device.uuid })
        }.bind(this));
    });

    function intervalFunction() {
        Connection.request("notification/pending", { id: messagingService.getLastMessage() })
            .then(function(response) {
                response.data.data.notifications.forEach(function(element) {
                    messagingService.receive(element);
                }, this);
                if (response.data.meta.serial != userSerial) {
                    console.log("REFRESH!!");
                    Timeline.get(true);
                    userSerial = _(response.data.meta.serial).toInteger();
                    $localStorage.userSerial = userSerial;
                }

                //console.log(response);
                messagingService.receiveReply(response.data.data.responses)
            });

        // Compruebo el estado del flag que se setea cuando se resume la aplicacion
        if($localStorage.appResumed) {
            HealthStore.getSteptData();
            $localStorage.appResumed = false;
        }
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
