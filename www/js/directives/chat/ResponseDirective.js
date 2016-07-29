function ResponseDirective() {
    

    var LinkFunction = function(scope, element, attrs){
        var itemTrue, itemFalse;
        angular.forEach(element.find("div"), function(item){
            if(angular.element(item).hasClass("nire-false")){
                itemFalse = item
            }
            if(angular.element(item).hasClass("nire-true")){
                itemTrue = item
            }
        });

        scope.$watch(attrs.nireResponse, function(value) {
             if(value) {
                angular.element(itemFalse).css("display", "none")
                angular.element(itemTrue).css("display", "")
             } else {
                angular.element(itemTrue).css("display", "none")
                angular.element(itemFalse).css("display", "")
             }
        });
    }


    return {
        //template: "<div ng-include='template'></div>",
        link: LinkFunction,
        //controller: ControllerFunction,
        //scope: { message: "=" }
    }
}

angular.module("nire.directives")
    .directive("nireResponse", ResponseDirective);
