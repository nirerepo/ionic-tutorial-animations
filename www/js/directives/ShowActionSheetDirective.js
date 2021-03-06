function PlateActionSheetDirective(Timeline, $ionicActionSheet) {
    function LinkFunction(scope, element, attrs, controller, transcludeFn) {
        var deleteAction = function(){ Timeline.eliminarPlato(scope.plate, scope.meal, scope.day); }
        scope.showActionsheet = ShowActionSheet.bind(null, $ionicActionSheet, deleteAction, scope.plate.title)
    }

    return {
        replace: true,
        template: '<button class="button button-icon" ng-click="showActionsheet()"><i class="icon ion-more"></i></button>',
        link: LinkFunction,
        scope: {
            plate: "=plate",
            meal: "=meal",
            day: "=day"
        }
    }
}

function ExerciseActionSheetDirective(Timeline, $ionicActionSheet) {
    function LinkFunction(scope, element, attrs, controller, transcludeFn) {
        var deleteAction = function(){ Timeline.eliminarEjercicio(scope.exercise, scope.day); }
        scope.showActionsheet = ShowActionSheet.bind(null, $ionicActionSheet, deleteAction, scope.exercise.title)
    }

    return {
        replace: true,
        template: '<button class="button button-icon" ng-click="showActionsheet()"><i class="icon ion-more"></i></button>',
        link: LinkFunction,
        scope: {
            exercise: "=exercise",
            day: "=day"
        }
    }
}

function ShowActionSheet($ionicActionSheet, deleteAction, title){
    $ionicActionSheet.show({
        titleText: title,
        destructiveText: '<i class="icon ion-trash-b"></i>Eliminar',
        cancelText: 'Cancelar',
        cancel: function () {
            console.log('CANCELLED');
        },
        destructiveButtonClicked: function () {
            deleteAction()
            return true;
        }
    });
}

angular.module("nire.directives")
    .directive("nirePlateActionSheet", PlateActionSheetDirective)
    .directive("nireExerciseActionSheet", ExerciseActionSheetDirective);