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
}

angular.module('starter.services')
    .service('Login', LoginService);
