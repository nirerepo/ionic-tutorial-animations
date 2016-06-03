angular.module('starter.services')
    .factory('Login', function (Connection) {
    return {
        formLogin: function (user) {
            return Connection.request("login/login", { username: user.username, password: user.password })
                .then(function (result) {
                if (result.hash) {
                    Connection.currentHash = result.hash;
                    Connection.currentUsername = username;
                }
            });
        }
    };
});
