function ExcerciseController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Exercise, Timeline){
    $scope.data = {
        "exercises": [],
        "search": ''
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
    $scope.addExercise = function(exercise) {
        $scope.openExerciseDetails();
        console.log(exercise.fields);
        var fields = exercise.fields;
        var exerciseData = {name: fields.nombre[0], mets: fields.mets[0], id: fields.id[0], tipo: fields.tipo[0]}
        Exercise.add(exerciseData).then(function(result){
            Timeline.addExercise(exerciseData);
            $state.go("tab.dash");
        })
    }
    $scope.getExerciseType = function(type) {
        return Exercise.type[type];
    }

  $ionicModal.fromTemplateUrl('templates/exercises/track-details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("Asignada", $scope.modal);
  });
  $scope.openExerciseDetails = function() {
    console.log("Modal...");
    $scope.modal.show();
    console.log("open!");
  };
  $scope.closeExerciseDetails = function() {
    $scope.modal.hide();
  };
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