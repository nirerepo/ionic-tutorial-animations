angular.module('starter.controllers')

.controller('SignInCtrl', function ($scope, $state, $q, $location, Login) {
    this.user = { username: "", password: "" };
    this.pushToken = "This is the push token in a device.";
    
    /**
     * Intenta loguear un usuario a la aplicación por medio de username & password.
     */
    this.signIn = function() {
        
    }
    
    /**
     * Intenta loguear un usuario utilizando autenticacion de Facebook.
     */
    this.facebookSignIn = function() {
        
    }
    
    /**
     * 
     */
    this.showHelp = function() {
        
    }
    
    var promise = initiatePushPlugin($q, $state);
    if (promise)
        promise.then(function (token) {
            $scope.pushToken = token;
        });
    $scope.signIn = function (user) {
        Login.formLogin(user).then(function (data) {
            console.log('Sign-In', user);
            $state.go('tab.dash');
        });
    };
    $scope.showHelp = function (tipo) {
        if (!tipo)
            tipo = '';
        console.log("Show Help: ", tipo);
        $state.go('help' + tipo, { startpage: 0 });
    };
    $scope.trackFood = function () {
        $state.go('trackfood');
    };
    $scope.facebookLogin = function () {
        var fbLoginSuccess = function (userData) {
            var userId = userData.authResponse.userID;
            console.log('Sign-In', userId);
            $state.go('tab.dash');
        };
        facebookConnectPlugin.login(["public_profile", "email", "user_birthday"], fbLoginSuccess, function (error) { console.log(error); });
    };
})

