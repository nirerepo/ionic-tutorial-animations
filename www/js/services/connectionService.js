
function ConnectionService($http) {
    var self = this;

    var URL_JSON_READER = "http://nire0.gailen.es:8080/nire/";
    var URL_JSON_WRITER = "http://nire0.gailen.es:8080/nire/";

    self.currentHash = null;
    self.currentUsername = null;

    self.getHeaders = function(contentType){
        console.log("HEADERS", self.currentUsername, self.currentHash);
        return { 
            "security-token": window.localStorage['userhash'], 
            "security-user": window.localStorage['username'],
            "Accept-Language": "es-ES",
            "App-Domain": "movistar",
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
            if(!contentType)
                data = self.toQueryString(data)
        }
        return $http({
            headers: self.getHeaders(contentType),
            url: URL_JSON_WRITER + url,
            method: data ? "POST" : "GET",
            data: data,
            cache:false
        })
    }
}

angular.module('nire.services')
    .service('Connection', ConnectionService);
