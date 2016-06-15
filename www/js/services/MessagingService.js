/**
 * Manejar los mensajes a los usuarios
 */
function MessagingService($rootScope) {
    var lastMessage = 0;

    if (window.localStorage.shownMessages !== null && window.localStorage.shownMessages !== undefined)
        lastMessage = _.last(JSON.parse(window.localStorage.shownMessages));
        
    /**
     * Recibir desde el servidor un mensaje, adaptarlo para las estructuras utilizadas en el cliente
     * y notificar a los interesados de los eventos.
     * 
     * @param {{id: number, source: string, message: string}} message
     */
    this.receive = function(message) {
        splitMessage(message).forEach(function(element) {
            $rootScope.$broadcast('nire.chat.messageIncoming', { value: true });
            $rootScope.$broadcast('nire.chat.messageReceived', { message: adaptMessage(element) });

            lastMessage = element.id;
        });
    };

    /**
     * Obtener el id del ultimo mensaje
     */
    this.getLastMessage = function() {
        return lastMessage;
    };

    /**
     * setear el id del ultimo mensaje
     */
    this.setLastMessage = function(id) {
        lastMessage = id;
        console.log(lastMessage);
    };

    /**
     * Cambia la estructura de las notificaciones del servidor, por las notificaciones que el cliente entiende.
     * @param {{id: number, source: string, message: string, button: string}} serverMessage
     * @return {{id: number, source: string, type: string, text: string, options: [{text: string, value: string}]}}
     */
    function adaptMessage(serverMessage) {
        var result = {
            id: serverMessage.id,
            source: serverMessage.source,
            type: 'message',
            text: serverMessage.message
        };

        if(serverMessage.button) {
            result.type = 'options';
            result.options = toButtonStructure(serverMessage.button);
        }

        return result;
    }

    function toButtonStructure(buttons) {
        return buttons.split("@@").map(function(element) {
            var parts = element.split("##");
            return {
                text: parts[0],
                value: parts[1]
            };
        });
    }

    /**
     * Divide el mensaje en muchos mensajes más simples, de acuerdo a los limitadores que se encuentren
     * dentro del texto del mensaje. 
     * 
     * El servidor puede enviar un mensaje por estado, pero en el cliente queremos que se anime como varios
     * mensajes diferentes. Este es el método que dado un mensaje, retorna varios que son simplemente texto,
     * excepto el último que tendrá las demás opciones y botones.
     * 
     * @param {{id: number, source: string, message: string, button: string}} message
     */
    function splitMessage(message) {
        var text = message.message.split(/-{5,}/);

        var result = [];
        for(var i = 0; i < text.length; i++) {
            result.push({id: message.id, source: message.source, message: text[i]});
        }

        // Si hay botones, los botones apareceran unicamente en el último mensaje.
        if(message.button)
            result[result.length-1].button = message.button;

        return result;
    }
}

angular.module("nire.services")
    .service("messagingService", MessagingService);