/**
 * Gestiona las notificaciones push.
 * @class
 * @param {ng.IQService} $q
 * @param {ng.ui.IStateService} $state
 */
function PushService($q, $state) {
    this.init = function() {
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
        });
        
        this.push.on('notification', function(data) {
           $state.go(data.additionalData.redirect, data.additionalData.params);
        });
        
        this.push.on('error', function(data) {
            deferred.reject(data.message);
        });
        
        return deferred.promise;
    };
}

angular.module('starter.services')
    .service('push', PushService);
