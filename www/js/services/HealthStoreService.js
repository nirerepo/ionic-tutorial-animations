function HealthStoreService(Connection, $rootScope, $localStorage) {
    
    this.saveInformation = function(queryText) {
    }

    $rootScope.$on("onResume", function(event, data) { getSteptData(); });

    var saveSteps = function(response) {
        var date = moment(response.startDate).format('YYYYMMDD')
        var data = { date: date, steps: response.value }
        Connection.request("track/addSteps", data).then(function(){
            var lastUpdate = $localStorage.lastFitUpdate? moment($localStorage.lastFitUpdate):null;
            var currentUpdate = moment(response.startDate); 
            if(!lastUpdate || lastUpdate.isBefore(currentUpdate))
                $localStorage.lastFitUpdate = currentUpdate;
        });
    };

    var errorCallback = function() {
        console.log("No se pudo acceder: ", arguments);
    };

    var getSteptData = function() {
        // Obtengo la ultima fecha de actualizacion, si no existe, propongo un maximo de 5 dis en el pasado para pedir
        var lastUpdate = $localStorage.lastFitUpdate? moment($localStorage.lastFitUpdate) : moment().startOf('day').subtract(5, 'days');
        var autorized = $localStorage.fitAutorized? $localStorage.fitAutorized : false;

        if (navigator.health && autorized != false) {
            navigator.health.isAvailable(function() {
                navigator.health.requestAuthorization(['steps'], function() {
                    var now = moment()
                    while(lastUpdate.isBefore(now)) {
                        var endDate = moment(lastUpdate).add(1, 'days');
                        if(now.isBefore(endDate)) endDate = now;
                        navigator.health.queryAggregated({
                            startDate: lastUpdate.startOf('day').toDate(),
                            endDate: endDate.toDate(),
                            dataType: 'steps'
                        }, saveSteps, errorCallback);
                        lastUpdate = endDate;
                    }
                }, function(e) {
                    console.log("No se ha obtenido autorización.", e);
                });                
            });
        }
    }

    this.autorizeHealthService = function() {
        navigator.health.isAvailable(function() {
            navigator.health.requestAuthorization(['steps'], function() {
                $localStorage.fitAutorized = true;
                getSteptData();
            }, function(e) {
                console.log("No se ha obtenido autorización.", e);
            });                
        });
    }

    this.alertData = function() {
        console.log("HealthStore: alertData");
        if (navigator.health) {
            navigator.health.isAvailable(function() {
                alert('Vamos a intentar conectar al plugin... danos permiso!');
                var permAggregated = ['steps'];
                var permUnit = [];
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
                    // Autorizo al proceso de obtencion de pasos, y lo lanzo para que actualize
                    $localStorage.fitAutorized = true;
                    $rootScope.$broadcast('onResume');
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
    }
};
angular.module('nire.services')
    .service('HealthStore', HealthStoreService);
