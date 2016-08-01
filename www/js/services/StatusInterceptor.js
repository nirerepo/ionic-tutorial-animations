function StatusInterceptor($injector) {
    this.response = function(response) {        
        if(response.data.meta){
            if(!response.data.meta.perfiladoCompleto) {
                $injector.get("$state").go("tab.chat-detail");
                $injector.get("$rootScope").profileNedded = true
            } else {
                $injector.get("$rootScope").profileNedded = false
            }
        }
            
        return response;
    };
}

angular.module('nire.services')
    .service('StatusInterceptor', StatusInterceptor);
