/**
 * Manejar los mensajes a los usuarios.
 */
function MessagingService($rootScope, userStorage) {
    /**
     * Inicializa las estructuras donde se guardan los mensajes del usuario si es necesario
     */
    this.init = function() {
        if(!userStorage.messages) {
            console.log("Inicializando messages storage.");
            userStorage.messages = [];
            userStorage.responses = {};
        }
    };

    /**
     * Recibir desde el servidor un mensaje, adaptarlo para las estructuras utilizadas en el cliente
     * y notificar a los interesados de los eventos.
     * 
     * @param {{id: number, source: string, message: string}} message
     */
    this.receive = function(message) {
        splitMessage(message).forEach(function(element) {
            var adaptedMessage = adaptMessage(element);
            userStorage.messages.push(adaptedMessage);

            $rootScope.$broadcast('nire.chat.messageReceived', { message: adaptedMessage });
        });
    };

    /**
     * Recibir desde el servidor las respuestas a las notificaciones
     */
    this.receiveReply = function(reply){
        for (var attrname in reply) { 
            userStorage.responses[attrname] = reply[attrname];
        }
    };

    /**
     * Obtener el id del ultimo mensaje
     */
    this.getLastMessage = function() {
        var last = _.last(userStorage.messages);
        return last ? last.id : 0;
    };

    /**
     * Cambia la estructura de las notificaciones del servidor, por las notificaciones que el cliente entiende.
     * @param {{id: number, source: string, message: string, button: string, type: string, event: string}} serverMessage
     * @return {{id: number, source: string, type: string, text: string, event: string options: [{text: string, value: string}]}}
     */
    function adaptMessage(serverMessage) {
        // Copiamos todos los datos.
        var result = _.assign(serverMessage);

        // Adaptamos los campos que sabemos especiales.
        if(!result.type) result.type = 'message';

        // Para mantener compatibilidad con otras conversaciones.
        // Si el mensaje tiene botones, siempre el tipo sera 'options'
        // y codificamos las opciones de una forma más utilizable para esta nueva app
        if(result.button) {
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
                value: parts[1],
                script: parts[2]
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
        // Sólo tiene sentido si el mensaje tiene efectivamente, un mensaje.
        if(!message.message) return [message];

        var text = message.message.split(/-{5,}/);

        var result = [];
        for(var i = 0; i < text.length; i++) {
            // TODO: En lugar de los parametros, preservarlos y modificar unicamente los necesarios
            result.push({id: message.id, source: message.source, type: message.type, message: text[i], event: message.event, value:message.value});
        }

        // Si hay botones, los botones apareceran unicamente en el último mensaje.
        if(message.button)
            result[result.length-1].button = message.button;

        return result;
    }

     this.init();
     $rootScope.$on("login", this.init);
}

angular.module("nire.services")
    .service("messagingService", MessagingService);