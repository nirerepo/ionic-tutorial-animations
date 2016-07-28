function ExcerciseController($scope, $ionicScrollDelegate, $state, $stateParams, $ionicHistory, $ionicModal, Exercise, Timeline, $analytics){
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
    $scope.$on("$ionicView.beforeEnter", function () {
       Exercise.getLastUsed().then(function(result){
            $scope.lastUsed = result.data.data.body.most_used
       });
    });

    $scope.clear = function() {
        $scope.data.search = '';
        $scope.data.exercises = [];
        $ionicScrollDelegate.scrollTop();
    }

    $scope.clearOrClose = function() {
        if ($scope.data.search == '')
            $scope.goBack();
        else
            $scope.clear();
    }

    $scope.search = function() {
        if ($scope.data.search.length >= 3){
            Exercise.exerciseByName($scope.data.search).then(function(matches) {
                $scope.data.exercises = _.filter(matches.data.hits.hits,
                                                    function(h) {
                                                        return h._score > 1;
                                                    });
                $ionicScrollDelegate.scrollTop();
            });
            $analytics.eventTrack('excercise_search', { category: "exercise", eventType: "search"});
        }
        else
            $scope.data.exercises = [];

    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.getExerciseType = function(type) {
        if(!type) return "";
        var types = type.split(",");
        return types.map(function(t){return Exercise.type[t]}).join();
    }

    $scope.exerciseModal = {
        addExercise : function(exercise) {
            $scope.data.exerciseTime = 5;
            var fields = exercise.fields;
            var mets = fields.mets? fields.mets[0] : 0
            $scope.data.selectedExercise = {name: fields.nombre[0], mets: mets, id: fields.id[0], tipo: fields.tipo[0] };
            $scope.modal.show();
        },
        addFrecuentExercise : function(exercise) {
            $scope.data.exerciseTime = 5;
            $scope.data.selectedExercise = {name: exercise.title, mets: exercise.mets, id: exercise.id, tipo: exercise.tipo };
            $scope.modal.show();
        },
        saveDetails : function() {
            $scope.modal.hide();

            var exerciseData = $scope.data.selectedExercise;
            var time = $scope.data.exerciseTime;
            var date = $stateParams.day;

            exerciseData.tiempo = time;
            Exercise.add(exerciseData, date).then(function(result){
                Timeline.addExercise(exerciseData, date);
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

angular.module('nire.controllers')
    .controller('ExerciseCtrl', ExcerciseController);
