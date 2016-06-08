function FacebookLoginDirective(Login, $state) {
    this.facebookLogin = function() {
        var success = function() { $state.go("tab.dash"); };
        var error = function() { console.log("Error al autenticar con facebook."); };
        Login.facebookLogin().then(success, error);        
    };

    function LinkFunction(scope, element, attrs, controller, transcludeFn) {
        scope.facebookLogin = this.facebookLogin;
    }

    return {
        replace: true,
        transclude: true,
        template: '<button class="button button-block button-facebook icon-left ion-social-facebook" ng-click="facebookLogin()" ng-transclude></button>',
        link: LinkFunction
    }
}

angular.module("starter.directives", [])
    .directive("nireFacebookLogin", FacebookLoginDirective);