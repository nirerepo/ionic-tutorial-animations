function ConnectionService($http, serverConfig) {
    var self = this;

    self.getHeaders = function(contentType){

        console.log(
            "Credenciales: ",
            window.localStorage['username'],
            window.localStorage['userhash']
        );

        var deviceId = "web"
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

        return $http({
            headers: self.getHeaders(contentType),
            url: serverConfig.writer + url,
            method: data ? "POST" : "GET",
            data: data,
            cache:false
        });
    };
}

angular.module('nire.services')
    .service('Connection', ConnectionService);
