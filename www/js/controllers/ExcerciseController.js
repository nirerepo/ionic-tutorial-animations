function ExcerciseController($scope, $state, $stateParams, $ionicHistory, $ionicModal, Exercise, Timeline){
    $scope.data = {
        "exercises": [],
        "search": '',
        "selectedExercise": null,
        "exerciseTime": 0
    };
    $scope.$on('$ionicView.enter', function() {
        $scope.data.search = '';
        $scope.data.exercises = [];
    });

    $scope.clear = function() {
        $scope.data.search = '';
        $scope.data.exercises = [];
    }

    $scope.search = function() {
        if ($scope.data.search.length >= 3)
            Exercise.exerciseByName($scope.data.search).then(function(matches) {
                $scope.data.exercises = _.filter(matches.data.hits.hits,
                                                    function(h) {
                                                        return h._score > 1;
                                                    });
            });
        else
            $scope.data.exercises = [];

    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.exerciseModal = {
        addExercise : function(exercise) {
            $scope.data.exerciseTime = 5;
            $scope.data.selectedExercise = exercise;
            $scope.modal.show();
        },
        saveDetails : function() {
            $scope.modal.hide();
            var fields = $scope.data.selectedExercise.fields;
            var time = $scope.data.exerciseTime;
            var mets = fields.mets? fields.mets[0] : 0

            var exerciseData = {name: fields.nombre[0], mets: mets, id: fields.id[0], tipo: fields.tipo[0], tiempo: time }
            Exercise.add(exerciseData).then(function(result){
                Timeline.addExercise(exerciseData);
                $state.go("tab.dash");
            });
          },
        closeExerciseDetails : function() {
            $scope.modal.hide();
        },
        increaseTime: function() {
            $scope.data.exerciseTime += 5;

        },
        decreaseTime: function() {
            if ($scope.data.exerciseTime > 5)
                $scope.data.exerciseTime -= 5;
        },
        keepOnlyNumbers: function() {
            $scope.data.exerciseTime = $scope.data.exerciseTime.replace(/\D/, '');
        }
    }

  $ionicModal.fromTemplateUrl('templates/exercises/track-details.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false
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
