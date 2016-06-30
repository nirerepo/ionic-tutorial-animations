function ChatController($scope, $interval, $timeout, $ionicScrollDelegate, Chats) {
    var INTERVALO_NUEVO_MENSAJE = 3000;
    var cancelInterval = null;

    function showNewMessage() {
        var message = Chats.getNewMessage();
        if(message) $ionicScrollDelegate.scrollBottom(true);
        $scope.writing = Chats.isWritingMessage();
    }

    $scope.$on('$ionicView.enter', function() {
        $scope.messages = Chats.getReadedMessages();
        cancelInterval = $interval(showNewMessage, INTERVALO_NUEVO_MENSAJE);
        $ionicScrollDelegate.scrollBottom(false);
    });

    $scope.$on('$ionicView.leave', function() {
        $interval.cancel(cancelInterval);
        cancelInterval = null;
    });
}

angular.module('nire.controllers')
    .controller('ChatDetailCtrl', ChatController)
