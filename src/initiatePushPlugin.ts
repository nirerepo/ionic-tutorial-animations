var push
function initiatePushPlugin($q, $state) {
    if (typeof PushNotification !== 'undefined') {
        this.$state = $state
        var deferred = $q.defer();
        var self = this;
        push = PushNotification.init({
            android: {
                senderID: 606551403580
            },
            ios: {
                
            },
            windows: {}
        });

        push.on('registration', function(data) {
            // data.registrationId
            //saveClientToken(data.registrationId)
            console.log(data.registrationId)
            deferred.resolve(data.registrationId)
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log(data.additionalData)
            console.log(data.additionalData.redirect)
            self.$state.go(data.additionalData.redirect, data.additionalData.params);
        });

        push.on('error', function(e) {
            deferred.reject(e.message)
        });
        return deferred.promise;
    }
}

