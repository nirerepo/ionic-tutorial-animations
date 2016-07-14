/**
 * Gestiona las notificaciones push.
 * @class
 * @param {ng.IQService} $q
 * @param {ng.ui.IStateService} $state
 */
function PushService($q, $state, Connection, $analytics) {
    this.token = "";
    var self = this;
    this.init = function() {
        var init = this;
        var deferred = $q.defer();
        if(!window.PushNotification || (typeof PushNotification == "undefined")) {
            console.log("No se encuentra el plugin Push al inicializar");
            deferred.reject("Push plugin no instalado.");
            return deferred.promise;
        }

        this.push = PushNotification.init({
            android: { senderID: "606551403580" },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });
        console.log("Push: push", this.push);
        
        this.push.on('registration', function(data) {
            console.log("Push:registration: ", data);
            deferred.resolve(data.registrationId);
            self.token = data.registrationId;
        });
        
        this.push.on('notification', function(data) {
            console.log("Push:Notification: ", data);
            if(data.additionalData.id){
                Connection.request('notification/trace', {id: data.additionalData.id, token: self.token, foreground: data.additionalData.foreground})
                    .then(function() {
                        init.push.finish()
                    });
                $analytics.eventTrack('pushRecieve', {eventType: "push", category: data.additionalData.id});
            } else {
                $analytics.eventTrack('pushEnter', {eventType: "push"});
            }
                
           $state.go(data.additionalData.redirect, data.additionalData.params);
        });
        
        this.push.on('error', function(data) {
            console.log("Push:Error: ", data);
            deferred.reject(data.message);
        });
        
        return deferred.promise;
    };
}

angular.module('nire.services')
    .service('push', PushService);
