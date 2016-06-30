/**
 * Gestiona las notificaciones push.
 * @class
 * @param {ng.IQService} $q
 * @param {ng.ui.IStateService} $state
 */
function PushService($q, $state, Connection) {
    this.token = "";
    var self = this;
    this.init = function() {
        var init = this;
        var deferred = $q.defer();
        if(!window.PushNotification) {
            deferred.reject("Push plugin no instalado.");
            return deferred.promise;
        }

        this.push = PushNotification.init({
            android: { senderID: "606551403580" }
        });
        
        this.push.on('registration', function(data) { 
            deferred.resolve(data.registrationId);
            self.token = data.registrationId;
        });
        
        this.push.on('notification', function(data) {
            console.log("evento notificacio ejecutado", data);
            if(data.additionalData.id){
                Connection.request('notification/trace', {id: data.additionalData.id, token: self.token, foreground: data.additionalData.foreground})
                    .then(function() {
                        init.push.finish()
                    })                
            }
                
           $state.go(data.additionalData.redirect, data.additionalData.params);
        });
        
        this.push.on('error', function(data) {
            deferred.reject(data.message);
        });
        
        return deferred.promise;
    };
}

angular.module('nire.services')
    .service('push', PushService);
