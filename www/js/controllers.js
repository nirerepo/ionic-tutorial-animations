angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicActionSheet) {
  $scope.cards = [
    {  },
    {  }
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function(index) {
    var newCard = // new card data
    $scope.cards.push(newCard);
  };

//
  $scope.showActionsheet = function() {
    $ionicActionSheet.show({
      titleText: 'ActionSheet Example',
      buttons: [
        { text: '<i class="icon ion-share"></i> Share' },
        { text: '<i class="icon ion-arrow-move"></i> Move' },
      ],
      destructiveText: 'Delete',
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
  $scope.showHelp = function() {
    console.log('show help');
    $state.go('help-actividad');
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

.controller('SignInCtrl', function($scope, $state) {

  $scope.signIn = function(user) {
    console.log('Sign-In', user);
    $state.go('tab.dash');
  };
  $scope.showHelp = function(tipo) {
    $state.go('help');
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
  $scope.data.currentPage = 0;
  console.log($ionicNavBarDelegate);
  console.log($stateParams);
  Help.loadPages($scope, $ionicNavBarDelegate);
  $ionicNavBarDelegate.showBackButton(true);
  window.plugins.toast.show("This is a help message", "long", "center");
})
;
