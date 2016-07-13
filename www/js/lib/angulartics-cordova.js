angular.module('angulartics.cordova.analytics', ['angulartics'])
  .config(['$analyticsProvider', function ($analyticsProvider) {
    $analyticsProvider.registerPageTrack(function (path) {
        window.analytics.trackView(path, function(){console.log("track page")}, function(error){console.log("could not start analytics", error)});
    });

    $analyticsProvider.registerEventTrack(function (action, properties) {

    });

  }])