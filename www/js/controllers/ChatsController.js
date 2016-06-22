function ChatController($scope, $state, $stateParams, $interval, $timeout, $ionicScrollDelegate, Chats) {
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

    $scope.notificationResponded = function(id) {
        return Chats.notificationResponded(id);
    };

    $scope.getResponseText = function(id) {
        return Chats.notificationResponded(id).message;
    };

    $scope.pressOption = function($event, opt, msgId) {
        var el = $event.currentTarget;
        if (opt.script)
            eval(opt.script);
        var elementDisplay = el.style.display;
        Array.prototype.forEach.call(el.parentNode.childNodes, function(child) {
            if (child.tagName == 'DIV' && child != el)
                child.style.display = 'none';
        });
        el.classList.remove('option');
        el.classList.add('user');
        el.parentNode.classList.remove('options');

        opt.answer = opt.value;
        Chats.replyMessage(opt, msgId);
    };

    $scope.respond = function($event, message) {
        // TODO: Esto debería mejorarse utilizando directivas. Cada tipo de mensaje debería ser una directiva
        // y tener un método value desde el cual poder obtener el valor elegido
        var el = $event.currentTarget;
        var value = el.parentNode.childNodes[0].value;
    
        var response = { value: value, event: message.event };
        Chats.replyMessage(response, message.id);
    };
}

angular.module('nire.controllers')
    .controller('ChatDetailCtrl', ChatController)
