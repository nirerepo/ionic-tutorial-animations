/**
 * Controller para permitirle a un usuario previamente registrado entrar a la aplicacion.
 * @class
 * @param {PushService} push
 * @param {LoginService} Login
 * @param {ng.ui.IStateService} $state
 */
function SignInCtrl(push, Login, $state) {
    this.user = Login.credentials;
    this.pushToken = "This is the push token in a device.";
    
    // Cuando se instancia este controller, aprovechamos para inicializar
    // las notificaciones push
    push.init().then(function(value) { 
        this.pushToken = value; 
    }.bind(this));
}

angular.module('starter.controllers')
    .controller('SignInCtrl', SignInCtrl);
