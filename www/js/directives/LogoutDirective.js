function LogoutDirective(Login, $state) {
    function LinkFunction(scope, element, attrs, controller, transcludeFn) {
        element.on("click", function() {
            Login.logout();
            $state.go("welcome");
        });
    }

    return {
        link: LinkFunction
    }
}

angular.module("nire.directives")
    .directive("nireLogout", LogoutDirective);
