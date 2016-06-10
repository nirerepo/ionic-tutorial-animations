function ExcerciseController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Exercise, Timeline){
    $scope.data = {
        "exercises": [],
        "search": '',
        "selectedExercise": null,
        "exerciseTime": "0.5"
    };
    $scope.$on('$ionicView.enter', function() {
        $scope.data.search = '';
    });

    $scope.clear = function() {
        $scope.data.search = '';
        $scope.data.exercises = [];
    }

    $scope.search = function() {
        console.log("Searching...", $scope.data.search);
        if ($scope.data.search.length >= 3)
            Exercise.exerciseByName($scope.data.search).then(function(matches) {
                $scope.data.exercises = matches.data.hits.hits;
            });
        else
            $scope.data.exercises = [];

    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.exerciseModal = {
        addExercise : function(exercise) {
            console.log("Modal...");
            $scope.data.selectedExercise = exercise;
            $scope.modal.show();
            console.log("open!");
        },
        saveDetails : function() {
            var fields = $scope.data.selectedExercise.fields;
            var time = $scope.data.exerciseTime;

            var exerciseData = {name: fields.nombre[0], mets: fields.mets[0], id: fields.id[0], tipo: fields.tipo[0], time: time }
            console.log("exerciseData: ", exerciseData);
            Exercise.add(exerciseData).then(function(result){
                Timeline.addExercise(exerciseData);
                $state.go("tab.dash");
            });
            $scope.modal.hide();
          },
        closeExerciseDetails : function() {
            $scope.modal.hide();
        }
    }

  $ionicModal.fromTemplateUrl('templates/exercises/track-details.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
}

angular.module('starter.controllers')
    .controller('ExerciseCtrl', ExcerciseController);
