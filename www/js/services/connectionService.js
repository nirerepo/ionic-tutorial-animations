angular.module('starter.services')
    .factory('Connection', function ($http) {
    var self = this;
    self.currentHash = null;
    self.currentUsername = null;

    var URL_JSON_READER = "http://nire0.gailen.es:8080/nire/";
    var URL_JSON_WRITER = "http://nire0.gailen.es:8080/nire/";

    self.getHeaders = function(){
        return { 
            "security-token": self.currentHash, 
            "security-user": self.currentUsername,
            "Accept-Language": "en-AR",
            "App-Domain": "nire",
            "App-TimezoneOffset": new Date().getTimezoneOffset()
        };
    };
    return {
        request: function (url, data) {
            return $http({
                headers: self.getHeaders(),
                url: URL_JSON_WRITER + url,
                method: data ? "POST" : "GET",
                data: data,
                cache:false
            })
        }
    }
});
