/**
 * Controller para solicitarle a un usuario su contraseña u ofrecerle enviar un MagicLink (tm)
 * 
 * @class
 * @param {LoginService} Login
 * @param {angular.ui.IStateService} $state
 */
function SignInPasswordCtrl(Login, $state) {
    this.user = Login.credentials;
    
    /**
     * Intenta loguear un usuario a la aplicación por medio de username & password.
     */
    this.signIn = function () {
        Login.formLogin().then(function (data) {
            $state.go("tab.dash");
        });
    }.bind(this);
}

angular.module('starter.controllers')
    .controller('SignInPasswordCtrl', SignInPasswordCtrl);
