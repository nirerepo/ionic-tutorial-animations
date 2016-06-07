/**
 * Funciones para loguear, desloguear y realizar consultas básicas
 * sobre el usuario logueado.
 * 
 * @param {ConnectionService} Connection
 * @param {angular.IQService} $q
 */
function LoginService(Connection, $q) {
    this.credentials = { 
        username: window.localStorage.username, 
        password: ""
    };
    this.currentUsername = "";
    this.currentHash = window.userhash;

    /**
     * Intenta loguearse utilizando las credenciales de usuario almacenadas en el servicio.
     */
    this.formLogin = function () {
        return Connection
            .request('login/login', this.credentials)
            .then(function (response) {
                var result = $q.defer();

                if (response.data.hash) {
                    this.currentUsername = response.data.assignedUsername;
                    this.currentHash = response.data.hash;

                    window.localStorage.username = this.currentUsername;
                    window.localStorage.userhash = this.currentHash;

                    result.resolve(response);
                }
                else {
                    result.reject(response);
                }

                return result.promise;
            });
    };

    /**
     * Intenta loguearse utilizando Facebook.
     */
    this.facebookLogin = function() {
        var result = $q.defer();

        // Si alguna promesa da error rechazamos la promesa principal
        var error = function() { console.log("Login Error", arguments); result.reject(); };

        var nireSuccess = function(response) {
            this.currentUsername = response.data.assignedUsername;
            this.currentHash = response.data.hash;

            window.localStorage.username = this.currentUsername;
            window.localStorage.userhash = this.currentHash;

            result.resolve(response);
        };

        // Si facebook resonde que todo OK, lo intentamos loguear en Nire.
        // La promesa solo se resuelve si Nire también loguea sin error.
        var facebookSuccess = function (userData) {
            console.log('Sign-In', userData.authResponse.userID);
            window.localStorage.app_credentials_facebook_id = userId;

            Connection
                .request('login/login', userData.authResponse.userID)
                .then(nireSuccess, error);
        };

        facebookConnectPlugin.login(["public_profile", "email", "user_birthday"], facebookSuccess, error);
        return result.promise;
    }
}

angular.module('starter.services')
    .service('Login', LoginService);