
function ConnectionService($http) {
    var self = this;

    var URL_JSON_READER = "http://localhost:8080/nire/";
    var URL_JSON_WRITER = "http://localhost:8080/nire/";

    self.currentHash = null;
    self.currentUsername = null;

    self.getHeaders = function(){
        return { 
            "security-token": self.currentHash, 
            "security-user": self.currentUsername,
            "Accept-Language": "en-AR",
            "App-Domain": "nire",
            "App-TimezoneOffset": new Date().getTimezoneOffset(),
            "Content-Type": 'application/x-www-form-urlencoded'
        };
    };

    self.request = function (url, data) {
        return $http({
            headers: self.getHeaders(),
            url: URL_JSON_WRITER + url,
            method: data ? "POST" : "GET",
            data: data ? $.param(data) : null,
            cache:false
        })
    }
}

angular.module('starter.services')
    .service('Connection', ConnectionService);
