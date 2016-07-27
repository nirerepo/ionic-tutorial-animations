function ConnectionService($http, serverConfig, $ionicPlatform, $q) {
    var self = this;

    self.getHeaders = function(contentType){
        var deviceId = "web";
        if(typeof device != "undefined")
            deviceId = device.uuid;

        return { 
            "security-token": window.localStorage['userhash'], 
            "security-user": window.localStorage['username'],
            "Accept-Language": "es-ES",
            "App-Domain": "movistar",
            "security-device": deviceId,
            "App-TimezoneOffset": new Date().getTimezoneOffset(),
            "Content-Type": contentType ? contentType : 'application/x-www-form-urlencoded'
        };
    };

    self.toQueryString = function(obj) {
      return _.map(obj,function(v,k){
        return encodeURIComponent(k) + '=' + encodeURIComponent(v);
      }).join('&');
    };

    self.request = function (url, data, contentType) {
        if(data) {
            if(!contentType) {
                data = self.toQueryString(data);
            }
        }

        var defer = $q.defer();

        // Demoramos la ejecucion efectiva del request hasta el momento
        // en que la plataforma este inicializada. De esta manera nos aseguramos
        // de tener siempre el id de dispositivo.
        $ionicPlatform.ready(function() {
            var headers = self.getHeaders(contentType); 

            var logResult = function(status) {
                return function() {
                    console.log(status, url, headers);
                };
            };

            var result = $http({
                headers: headers,
                url: serverConfig.writer + url,
                method: data ? "POST" : "GET",
                data: data,
                cache:false
            });

            result.then(function(data) { logResult("Call Success"); defer.resolve(data); });
            result.catch(function(data) { logResult("Call Error"); defer.reject(data); });
        });



        return defer.promise;
    };
}

angular.module('nire.services')
    .service('Connection', ConnectionService);
