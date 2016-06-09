function ExcerciseController($scope, $state, $stateParams, $ionicHistory, Exercise, Timeline){
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
}

angular.module('starter.controllers')
    .controller('ExerciseCtrl', ExcerciseController);
