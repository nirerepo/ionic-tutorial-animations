angular.module('angulartics.cordova.analytics', ['angulartics'])
  .config(['$analyticsProvider', function ($analyticsProvider) {
    $analyticsProvider.registerPageTrack(function (path) {
        if(window.analytics)
            window.analytics.trackView(path, function(){console.log("track page")}, function(error){console.log("could not start analytics", error)});
    });

    $analyticsProvider.registerEventTrack(function (action, properties) {
        console.log(action, properties);
        if(window.analytics)
            window.analytics.trackEvent(
                properties.eventType, 
                action, 
                properties.category,
                -1,
                function(){console.log("track event")}, 
                function(error){console.log("could not send event", error)}
            );
    });

  }])