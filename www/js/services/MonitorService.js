/**
 * Consulta periodicamente al servidor en busca de notificaciones u otras operaciones.
 * @param {angular.IIntervalService} $interval
 */
function MonitorService(Connection, $interval, $rootScope) {
    /** @type number */
    var delay = 5000;

    /** @type ng.IPromise<any> */
    var intervalPromise = null;

    /** @type number */
    var lastMessage = 0;

    if (window.localStorage.shownMessages !== null && window.localStorage.shownMessages !== undefined)
        lastMessage = _.last(JSON.parse(window.localStorage.shownMessages));    

    function intervalFunction() {
        Connection.request("notification/pending", { id: lastMessage })
            .then(function(response) {
                response.data.data.notifications.forEach(function(element) {
                    $rootScope.$broadcast('nire.chat.messageIncoming', { value: true });
                    $rootScope.$broadcast('nire.chat.messageReceived', { message: adaptMessage(element) });

                    lastMessage = element.id;
                }, this);
            });
            
        function adaptMessage(serverMessage) {
            return {
                id: serverMessage.id,
                source: serverMessage.source,
                type: 'message',
                text: serverMessage.message
            };
        }
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

angular.module("starter.services")
    .service("Monitor", MonitorService);
