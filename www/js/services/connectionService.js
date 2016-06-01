angular.module('starter.services')

.factory('Connection', function($http) {
    var self = this;
    self.currentHash = null;
    self.currentUsername = null;

    var URL_JSON_READER = "http://192.168.0.14:8080/nire/";
    var URL_JSON_WRITER = "http://192.168.0.14:8080/nire/";

    self.getHeaders = function(){
        return { 
            "security-token": self.currentHash, 
            "security-user": self.currentUsername,
            "Accept-Language": "en-AR",
            "App-Domain": "nire",
            "App-TimezoneOffset": new Date().getTimezoneOffset()
            //"security-device": deviceId,
            //"App-Version": APP_VERSION,
            //"App-Build" : BUILD_VERSION_CODE
        };
    }

    return {
        request: function(url, data){
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