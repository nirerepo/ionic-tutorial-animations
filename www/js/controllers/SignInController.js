/**
 * Controller para permitirle a un usuario previamente registrado entrar a la aplicacion.
 * @class
 * @param {PushService} push
 * @param {LoginService} Login
 * @param {ng.ui.IStateService} $state
 */
function SignInCtrl(push, Login, $state) {
    this.user = { username: "", password: "" };
    this.pushToken = "This is the push token in a device.";
    
    // Cuando se instancia este controller, aprovechamos para inicializar
    // las notificaciones push
    push.init().then(function(value) { 
        this.pushToken = value; 
    }.bind(this));

    /**
     * Intenta loguear un usuario a la aplicación por medio de username & password.
     */
    this.signIn = function() {
        Login.formLogin(this.user).then(function(data) {
            $state.go("tab.dash");
        });        
    }.bind(this);

    /**
     * Intenta loguear un usuario utilizando autenticacion de Facebook.
     */
    this.facebookSignIn = function() {
        var fbLoginSuccess = function (userData) {
            var userId = userData.authResponse.userID;
            console.log('Sign-In', userId);
            $state.go('tab.dash');
        };
        facebookConnectPlugin.login(["public_profile", "email", "user_birthday"], fbLoginSuccess, function (error) { console.log(error); });
    };
}

angular.module('starter.controllers')
    .controller('SignInCtrl', SignInCtrl);
