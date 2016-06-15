angular.module('nire', [
    'nire.controllers',
    'ionic',
    'nire.services',
    'nire.directives',
    'ksSwiper'
])
    .run(function (Monitor, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        // Agregamos un Interceptor para que si el servidor responde
        // que el usuario no esta logueado, se le muestre la pantalla de login
        $httpProvider.interceptors.push('LoginInterceptor');

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'templates/welcome.html'
            })
        
            .state('signin', {
                url: '/sign-in',
                templateUrl: "templates/sign-in.html",
                controller: 'SignInCtrl as vm'
            })
            
            .state('signin-password', {
                url: '/signin-password',
                templateUrl: 'templates/sign-in-password.html',
                controller: 'SignInPasswordCtrl as vm'
            })
            
            .state('signin-email', {
                url: '/signin-email',
                templateUrl: 'templates/sign-in-email.html'
            })
            
            .state('registro-datos', {
                url: '/registro-datos',
                templateUrl: 'templates/registro/datos.html'
            })

            .state('registro-numero', {
                url: '/registro-numero',
                templateUrl: 'templates/registro/numero.html'
            })

            .state('registro-no-movistar', {
                url: '/registro-no-movistar',
                templateUrl: 'templates/registro/no-movistar.html'
            })
            
            .state('registro-codigo', {
                url: '/registro-codigo',
                templateUrl: 'templates/registro/codigo.html'
            })
            
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            .state('trackfood', {
                url: '/trackfood/:mealId/:day',
                templateUrl: 'templates/track-food.html',
                controller: 'FoodCtrl'
            }).state('trackexercise', {
                url: '/trackexercise/:day',
                templateUrl: 'templates/track-exercise.html',
                controller: 'ExerciseCtrl'
            })
            .state('help', {
                url: '/help',
                params: { startpage: { dynamic: true } },
                templateUrl: 'templates/help.html',
                controller: 'HelpCtrl'
            })
            .state('helpactividad', {
                url: '/helpactividad',
                params: { startpage: { dynamic: true } },
                templateUrl: 'templates/help-actividad.html',
                controller: 'HelpCtrl'
            });

            // La URL default es el Timeline. Si cuando se intenta mostrar el timeline o hacer
            // cualquier otra acción el servidor retorna que no se esta autenticado, entonces
            // recién en ese momento lo llevamos al Login.
            $urlRouterProvider.otherwise('/tab/dash');
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
    });
