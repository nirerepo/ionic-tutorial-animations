/**
 * Controller de la interfaz para registrar un usuario nuevo, tanto pidiendo los datos iniciales
 * del usuario o el registro por medio de facebook.
 * 
 * @param {LoginService} Login
 * @param {angular.ui.IStateService} $state
 */
function RegisterController(Login, $state) {
    this.facebookLogin = function() {
        var success = function() {
            Login.getUserDataFromFacebook();
            $state.go("tab.dash");
        };
        var error = function() { console.log("Error al autenticar con facebook."); }.bind(this);
        Login.facebookLogin().then(success, error);        
    };
}

angular.module('starter.controllers')
    .controller('RegisterCtrl', RegisterController);
