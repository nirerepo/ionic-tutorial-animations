/**
 * HTTP Interceptor para verificar que el servidor no informe que el usuario no se encuentra logueado.
 * 
 * Si algun request retorna un status 401 se entiende que el usuario no se encuentra logueado y
 * se lo redirigue a la interfaz de login.
 * 
 * Se necesita el injector explicitamente para no tener una dependencia circular con $state. Otra
 * solución sugerida es emitir un evento y escucharlo en el rootScope. No utilizamos esta alternativa
 * para mantener el scope lo más libre posible y el código de login lo mas centralizado posible.
 * 
 * @constructor
 * @param {angular.auto.IInjectorService} $injector
 */
function LoginInterceptor($injector) {
    this.response = function(response) {
        // Si la solicitud exitosa corresponde al servidor reiniciamos el monitor
        if(response.config.url.indexOf("http") === 0) {
            console.log("Usuario logueado. Iniciando monitoreo");
            $injector.get("Monitor").start();
        }
        return response;
    };

    /**
     * Intercepta los request que retornan 401 para redirigir al usuario a la página de login.
     * @param {{status: number}} response
     */
    this.responseError = function(response) {
        // a diferentes paginas.
        if(response.status === 401) {
            console.log("El usuario se encuentra deslogueado. Redirigiendo al login.");
            $injector.get("Monitor").stop();
            $injector.get("$state").go("welcome");
        }
        return response;
    };
}

angular.module('nire.services')
    .service('LoginInterceptor', LoginInterceptor);
