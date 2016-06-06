
function ConnectionService($http) {
    var self = this;

    var URL_JSON_READER = "http://nire0.gailen.es:8080/nire/";
    var URL_JSON_WRITER = "http://nire0.gailen.es:8080/nire/";

    self.currentHash = null;
    self.currentUsername = null;

    self.getHeaders = function(){
        console.log("HEADERS", self.currentUsername, self.currentHash);
        return { 
            "security-token": window.localStorage['userhash'], 
            "security-user": window.localStorage['username'],
            "Accept-Language": "es-ES",
            "App-Domain": "movistar",
            "App-TimezoneOffset": new Date().getTimezoneOffset(),
            "Content-Type": 'application/x-www-form-urlencoded'
        };
    };

    self.toQueryString = function(obj) {
      return _.map(obj,function(v,k){
        return encodeURIComponent(k) + '=' + encodeURIComponent(v);
      }).join('&');
    };

    self.request = function (url, data) {
        return $http({
            headers: self.getHeaders(),
            url: URL_JSON_WRITER + url,
            method: data ? "POST" : "GET",
            data: data ? self.toQueryString(data) : null,
            cache:false
        })
    }
}

angular.module('starter.services')
    .service('Connection', ConnectionService);
