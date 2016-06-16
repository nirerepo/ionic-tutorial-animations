function ChatService($rootScope, $interval, $timeout, Connection) {
    var receivedMessages = [];  // Recibidos, aún sin mostrar

    // Acumulamos los mensajes ya recibidos desde el monitor...
    // ...y se mostrarán suavemente cuando se vuelva a abrir el chat

    $rootScope.$on('nire.chat.messageReceived', function(event, msg) {
        // TODO: ¿Quizás en paralelo a esto, podemos almacenar los recibidos
        // en localstorage, e inicializar desde ahí al arrancar el servicio?
        $timeout(function() {
            $rootScope.$broadcast('nire.chat.messageIncoming', { value: false });
            receivedMessages.push(msg);
        }, 700);
    });

    var msgAnimator;

    this.start = function(messages, pending) {
        console.log("Chat animator START");
        msgAnimator = $interval(function() {
            var msg = '';
            if (receivedMessages.length > 0) {
                msg = receivedMessages.shift();
                messages.push(msg.message);
                window.localStorage.shownMessages = JSON.stringify(messages);
            }
        }, 1000);
    }
    
    this.stop = function() {
        $interval.cancel(msgAnimator);
    }
    
    this.replyMessage = function(opt, msgId) {
        var data = {answer: opt.value, text: opt.text, notificationId: msgId}
        Connection.request("notification/reply", data)
    }
}

angular.module('nire.services')
    .service('Chats', ChatService);
