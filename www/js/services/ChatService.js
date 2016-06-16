function ChatService($rootScope, $interval, $timeout, Connection, $localStorage) {
    var self = this;

    this.getLastReadedMessage = function() {
        return $localStorage.lastReadedMessage;
    };

    var receivedMessages = _.dropWhile($localStorage.messages, function(element) {
        return element.id <= self.getLastReadedMessage();
    });

    this.getReadedMessages = function() {
        return _.takeWhile($localStorage.messages, function(element) {
            return element.id <= self.getLastReadedMessage();
        });
    };

    this.getNewMessages = function() {
        return receivedMessages;
    };

    $rootScope.$on('nire.chat.messageReceived', function(event, msg) {
        receivedMessages.push(msg);
    });

    /*

    var msgAnimator;

    this.start = function(messages, pending) {
        console.log("Chat animator START");
        msgAnimator = $interval(function() {
            var msg = '';
            if (receivedMessages.length > 0) {
                msg = receivedMessages.shift();
                messages.push(msg.message);
            }
        }, 1000);
    };
    
    this.stop = function() {
        $interval.cancel(msgAnimator);
    };
    */
    
    this.replyMessage = function(opt, msgId) {
        var data = {answer: opt.value, text: opt.text, notificationId: msgId};
        Connection.request("notification/reply", data);
    };
}

angular.module('nire.services')
    .service('Chats', ChatService);
