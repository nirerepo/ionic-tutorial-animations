/**
 * Funciones para loguear, desloguear y realizar consultas básicas
 * sobre el usuario logueado.
 * 
 * @param {ConnectionService} Connection
 */
function LoginService(Connection) {
    this.credentials = { username: "", password: "" };
    this.currentUsername = "";
    this.currentHash = "";

    /**
     * Intenta loguearse utilizando las credenciales del servicio.
     */
    this.formLogin = function () {
        return Connection
            .request('login/login', this.credentials)
            .then(function (result) {
                if (result.data.hash) {
                    this.currentUsername = result.data.assignedUsername;
                    this.currentHash = result.data.hash;
                    window.localStorage['username'] = this.currentUsername;
                    window.localStorage['userhash'] = this.currentHash;
                }
            });

    };
}

angular.module('starter.services')
    .service('Login', LoginService);
