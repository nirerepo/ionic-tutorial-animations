/**
 * Controller para solicitarle a un usuario su contraseña u ofrecerle enviar un MagicLink (tm)
 * 
 * @class
 * @param {LoginService} Login
 * @param {angular.ui.IStateService} $state
 */
function SignInPasswordCtrl(Login, $state) {
    this.user = Login.credentials;
    this.error = false;;
    
    /**
     * Intenta loguear un usuario a la aplicación por medio de username & password.
     */
    this.signIn = function () {
        var success = function() { $state.go("tab.dash"); };
        var error = function() { this.error = true; }.bind(this);
        Login.formLogin().then(success, error);
    }.bind(this);
}

angular.module('starter.controllers')
    .controller('SignInPasswordCtrl', SignInPasswordCtrl);
