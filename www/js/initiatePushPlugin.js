var push
function initiatePushPlugin() {
    if (typeof PushNotification !== 'undefined') {
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
        });

        /*push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log(data.additionalData)
            if(!data.additionalData.foreground)
                processAutoLogin(data.additionalData.token);
        });*/

        push.on('error', function(e) {
            console.log(e.message)
        });
    }
}

