function ChatService($rootScope, Connection, userStorage) {
    var self = this;

    // Registramos en el rootScope una funcion para recuperar la cantidad
    // de mensajes pendientes de leer
    $rootScope.chatBadge = function() {
        return (self.isWritingMessage() === true) ? "!!" : "";
    };

    // Lista de los mensajes leidos. Esta lista se inicializa desde
    // localStorage y se agregan elementos a travez de getNewMessage
    var readedMessages = _.takeWhile(userStorage.messages, function(element) {
        return element.id <= userStorage.lastReadedMessage || 0;
    });

    // Lista con los mensajes que aún no fueron leidos. Esta lista se inicializa
    // desde localStorage y se van quitando elementos a medida que se llama
    // a getNewMessage
    var receivedMessages = _.dropWhile(userStorage.messages, function(element) {
        return element.id <= userStorage.lastReadedMessage || 0;
    });

    /**
     * Retorna la lista de mensajes que ya fueron leidos. Esta es una lista viva
     * a la cual se van agregando elementos a medida que se van leyendo mensajes.
     */
    this.getReadedMessages = function() {
        return readedMessages;
    };

    /**
     * Devuelve true si el sistema tiene mensajes ya recibidos para mostrar
     */
    this.isWritingMessage = function() {
        return (receivedMessages != undefined) && (receivedMessages.length > 0);
    }
    /**
     * Si hay un mensaje no leido, lo pasa a la lista de mensajes leidos y retorna
     * el mensaje.
     * 
     * @return {{id: number}} Nuevo mensaje o null si no hay ningun mensaje nuevo.
     */
    this.getNewMessage = function() {
        var message = receivedMessages.shift();
        if(!message) return null; // Si no hay mensaje nuevo no hacemos nada.

        readedMessages.push(message);
        userStorage.lastReadedMessage = message.id;
        return message;
    };

    /**
     * Olvidar el estado de todo y reiniciar el modelo de datos
     */
    this.clear = function() {
        delete userStorage.lastReadedMessage;

        readedMessages.length = 0;
        receivedMessages.length = 0;
    };

    // Cuando se recibe un nuevo mensaje agregarlo a la lista de mensajes no leidos.
    $rootScope.$on('nire.chat.messageReceived', function(event, msg) {
        receivedMessages.push(msg.message);
    });

    /**
     * Recuperar la respuesta a una notificación.
     */
    this.getResponse = function(id){
        return userStorage.responses[id];
    };

    /**
     * Response una notificación.
     */
    this.replyMessage = function(reply, msgId) {
        console.log("Respondiendo mensaje", msgId, reply);
        reply.notificationId = msgId;

        // Guardamos inmediatamente la respuesta para dar un feedback rapido al usuario
        userStorage.responses[msgId] = {
            message: reply.text ? reply.text : reply.value,
            notification: msgId
        };

        Connection.request("notification/answer", reply, "application/json");
    };
}

angular.module('nire.services')
    .service('Chats', ChatService);
