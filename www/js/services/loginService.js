/**
 * Funciones para loguear, desloguear y realizar consultas básicas
 * sobre el usuario logueado.
 * 
 * @param {ConnectionService} Connection
 * @param {MonitorService} Monitor
 * @param {angular.IQService} $q
 */
function LoginService(Connection, Monitor, $q, $rootScope, $state) {
    this.credentials = { 
        username: window.localStorage.username, 
        password: ""
    };
    this.currentUsername = "";
    this.currentHash = window.userhash;

    /**
     * Desloguea al usuario actual de la aplicación.
     */
    this.logout = function() {
        this.currentHash = "";
        window.localStorage.userhash = this.currentHash;
        this.credentials.password = "";
        Monitor.stop();
    };

    /**
     * Intenta loguearse utilizando las credenciales de usuario almacenadas en el servicio.
     */
    this.formLogin = function () {
        var result = $q.defer();

        var nireSuccess = this._loginSuccess.bind(this);
        return Connection
            .request('login/login', this.credentials)
            .then( this._loginSuccess.bind(this, result) );
    };

    /**
     * Intenta loguearse utilizando Facebook.
     */
    this.facebookLogin = function() {
        var result = $q.defer();

        // Si alguna promesa da error rechazamos la promesa principal
        var error = function() { console.log("Login Error", arguments); result.reject(); };

        var nireSuccess = function(response) {
            this._loginSuccess(result, response);
            this.getUserDataFromFacebook();
        }.bind(this);

        // Si facebook resonde que todo OK, lo intentamos loguear en Nire.
        // La promesa solo se resuelve si Nire también loguea sin error.
        var facebookSuccess = function (userData) {
            console.log('Sign-In', userData.authResponse.userID);
            window.localStorage.app_credentials_facebook_id = userData.authResponse.userID;

            Connection
                .request('login/facebookLogin', { userId: userData.authResponse.userID })
                .then(nireSuccess, error);
        };

        facebookConnectPlugin.login(["public_profile", "email", "user_birthday"], facebookSuccess, error);
        return result.promise;
    };

    this.getUserDataFromFacebook = function() {
        var userId = window.localStorage.app_credentials_facebook_id;
        facebookConnectPlugin.api(userId + "/?fields=name,gender,email,birthday", [],
            function success(userData) {
                Connection
                    .request("registry/facebookBiography", {
                        name: userData.name, 
                        gender:userData.gender, 
                        email: userData.email, 
                        birthday: userData.birthday
                    });
            },
            function onError (error) { console.error("TODO: Controlar error al recuperar datos de Facebook: ", error); }
        );
    };

    this._loginSuccess = function(result, response) {
        if (!response.data.hash) {
            result.reject(response);
            return result.promise;
        }

        this.currentUsername = response.data.assignedUsername;
        this.currentHash = response.data.hash;

        window.localStorage.username = this.currentUsername;
        window.localStorage.userhash = this.currentHash;

        result.resolve(response);

        // Emitimos un evento informando que se produjo un login
        $rootScope.$emit("login", this.currentUsername);

        if(response.data.redirect == "biography") {
            $rootScope.profileNedded = true
            $state.go("tab.chat-detail", {chatId: 1}); 
        }else {
            $state.go("tab.dash"); 
        }

        return result.promise;
    };
}

angular.module('nire.services')
    .service('Login', LoginService);