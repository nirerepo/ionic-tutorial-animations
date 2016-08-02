/**
 * Controller para solicitarle a un usuario su contraseña u ofrecerle enviar un MagicLink (tm)
 * 
 * @class
 * @param {LoginService} Login
 * @param {angular.ui.IStateService} $state
 */
function SignInPasswordCtrl(Login, $state) {
    this.user = Login.credentials;
    this.error = false;
    
    /**
     * Intenta loguear un usuario a la aplicación por medio de username & password.
     */
    this.signIn = function () {
        var success = function() {  };
        var error = function() { this.error = true; }.bind(this);
        Login.formLogin().then(success, error);
    }.bind(this);
}

angular.module('nire.controllers')
    .controller('SignInPasswordCtrl', SignInPasswordCtrl);
