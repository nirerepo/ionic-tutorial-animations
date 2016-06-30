/**
 * Controller para permitirle a un usuario previamente registrado entrar a la aplicacion.
 * @class
 * @param {PushService} push
 * @param {LoginService} Login
 * @param {ng.ui.IStateService} $state
 */
function SignInCtrl(Login, $state) {
    this.user = Login.credentials;
    
}

angular.module('nire.controllers')
    .controller('SignInCtrl', SignInCtrl);
