function HealthStoreService($q, $http, Connection) {
    this.saveInformation = function(queryText) {
    }

    this.alertData = function() {
        console.log("HealthStore: alertData");
        if (navigator.health) {
            navigator.health.isAvailable(function() {
                alert('Vamos a intentar conectar al plugin... danos permiso!');
                var permAggregated = ['steps','calories', 'calories.active', 'calories.basal'];
                var permUnit = ['height', 'weight', 'gender', 'date_of_birth'];
                var successCallbackUnit = function(response) {
                    console.log(response);
                    if (response.length>0)
                        alert(response[0].value);
                };
                var successCallbackAggregated = function(response) {
                    alert(response.value);
                };
                var errorCallback = function() {
                    console.log("No se pudo acceder: ", arguments);
                };
                navigator.health.requestAuthorization(permAggregated.concat(permUnit), function() {
                    permAggregated.forEach(function(item) {
                        navigator.health.queryAggregated({
                            startDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000), // three days ago
                            endDate: new Date(), // now
                            dataType: item
                        }, successCallbackAggregated, errorCallback)
                    });
                    permUnit.forEach(function(item) {
                        navigator.health.query({
                            startDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000), // three days ago
                            endDate: new Date(), // now
                            dataType: item
                        }, successCallbackUnit, errorCallback)
                    });
                }, function(e) {
                    alert("No se ha obtenido autorización." + e);
                });
            }, function() {
                alert('Health Store no disponible');
            });
        } else {
            alert('El dispositivo no puede conectar con el Health Store');
        }
    }};
angular.module('nire.services')
    .service('HealthStore', HealthStoreService);
