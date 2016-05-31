angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicActionSheet, Timeline) {
  $scope.cards = [
    {  },
    {  }
  ];

  $scope.desayuno = Timeline.desayuno();
  console.log($scope.desayuno);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function(index) {
    var newCard = // new card data
    $scope.cards.push(newCard);
  };

//
  $scope.showActionsheet = function(plato) {
    var title = '';
    if (plato)
      title = plato.name;
    $ionicActionSheet.show({
      titleText: title,
      buttons: [
        { text: '<i class="icon ion-arrow-move"></i>Cantidades' },
        { text: '<i class="icon ion-arrow-move"></i>Sustituir' }
      ],
      destructiveText: '<i class="icon ion-share"></i>Quitar',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        console.log('BUTTON CLICKED', index);
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      }
    });
  };
//

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $state, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
  $scope.showHelp = function(tipo) {
    if (!tipo)
        tipo = ''
    console.log("Show Help: ", tipo);
    $state.go('help'+tipo, {startpage: 2});
  };
})

.controller('AccountCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true,
    enableOtrascosas: true,
    enableYotramastodavia: true
  };
  $scope.signOut = function() {
    console.log("Sign-Out");
    $state.go('signin');
  };
})

.controller('SignInCtrl', function($scope, $state, $q, $location) {
  
  var promise = initiatePushPlugin($q, $state);
  promise.then(function(token){
    $scope.pushToken = token;
  })

  $scope.signIn = function(user) {
    console.log('Sign-In', user);
    $state.go('tab.dash');
  };
  $scope.showHelp = function(tipo) {
    if (!tipo)
        tipo = ''
    console.log("Show Help: ", tipo);
    $state.go('help'+tipo, {startpage: 0});
  };
  $scope.facebookLogin = function(){
    var fbLoginSuccess = function (userData) {
      var userId = userData.authResponse.userID;
      console.log('Sign-In', userId);
      $state.go('tab.dash');
    }

    facebookConnectPlugin.login(["public_profile", "email", "user_birthday"],
      fbLoginSuccess,
      function (error) { console.log(error) }
    );
  }


})

.controller('HelpCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, Help) {
  $scope.data = {};
  $scope.data.bgColors = [];
  $scope.data.currentPage = $stateParams.startpage;
  console.log("Current: ", $scope.data);
  Help.loadPages($scope, $ionicNavBarDelegate);
  $ionicNavBarDelegate.showBackButton(true);
  if (window.plugins && window.plugins.toast)
    window.plugins.toast.show("This is a help message", "long", "center");
})
;
