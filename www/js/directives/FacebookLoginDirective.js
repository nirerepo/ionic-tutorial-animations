function FacebookLoginDirective(Login, $state) {
    this.facebookLogin = function() {
        var success = function() { 
            plugins.toast.show('Conectado mediante Facebook', 5000, 'top');
            //$state.go("tab.dash"); 
        };

        var error = function() { console.log("Error al autenticar con facebook."); };
        Login.facebookLogin().then(success, error);      
    };

    function LinkFunction(scope, element, attrs, controller, transcludeFn) {
        scope.facebookLogin = this.facebookLogin;
    }

    return {
        replace: true,
        transclude: true,
        template: '<button class="button button-block button-facebook icon-left ion-social-facebook" ng-click="facebookLogin()" ng-transclude analytics-on="click" analytics-event="login" analytics-category="facebook"></button>',
        link: LinkFunction
    }
}

angular.module("nire.directives", [])
    .directive("nireFacebookLogin", FacebookLoginDirective);
