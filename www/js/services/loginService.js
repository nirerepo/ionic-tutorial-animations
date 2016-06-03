angular.module('starter.services')
    .factory('Login', function (Connection) {
    return {
        formLogin: function (user) {
            return Connection.request("login/login", { username: user.username, password: user.password })
                .then(function (result) {
                if (result.data.hash) {
                    Connection.currentHash = result.data.hash;
                    Connection.currentUsername = result.data.assignedUsername;
                }
            });
        }
    };
});
