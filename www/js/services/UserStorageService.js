/**
 * Gestiona el Storage por usuario.
 *
 * Idealmente utilizaríamos ES6 Proxy Object para atrapar la asiganción de propiedades
 * y mapearlas a $localStorage pero no está soportado en iOS al momento de codificar esta clase.
 * 
 * Utilizamos un truco similar al de $localStorage, que consiste en un timeout luego de cada digest
 * y copiar los valores al servicio de $localStorage. Temporalmente los valores se guardan como atributos
 * del mismo servicio. 
 */
function UserStorageService($localStorage, $rootScope, $timeout) {
    var self = this;

    var _lastStorage;
    var _debounce;

    // Copia los valores del servicio al $localStorage
    function apply() {
        var username = window.localStorage.username;
        if(!username) return;

        // Copiamos los valores de la clase al $localStorage
        // Mientras borramos de _lastStorage los datos que ya fueron copiados
        // para que ls restantes sean los que hay que borrar.
        for(var k in self) {
            if(!$localStorage[username]) $localStorage[username] = {};
            $localStorage[username][k] = self[k];

            delete _lastStorage[k];
        }

        for(var toDelete in _lastStorage) {
            delete $localStorage[username][toDelete];
        }

        // Self actual, pasa a ser _lastStorage
        _lastStorage = angular.copy(self);
        _debounce = null;
    }
    
    // Copia los atributos del $localStorage al servicio
    function sync() {
        var username = window.localStorage.username;
        if(!username) return;

        for(var toDelete in self) {
            delete self[toDelete];
        }

        for (var k in $localStorage[username]) {
            self[k] = $localStorage[username][k];
        }

        _lastStorage = angular.copy(self);
    }

    $rootScope.$watch(function() {
        _debounce || (_debounce = $timeout(apply, 100, false));
    });

    // Si se cambia el usuario se debe hacer un sync
    $rootScope.$on("login", function(event, username) {
        sync();
    });

    sync();
}

angular.module('nire.services')
    .service('userStorage', UserStorageService);
