interface DashControllerScope extends angular.IScope {
  desayuno: any;  
}

class DashController {
  public static $inject = ["$scope", "$ionicActionSheet", "Timeline"]
  public cards : any[]
  
  constructor(
    public $scope : DashControllerScope, 
    public $ionicActionSheet : ionic.actionSheet.IonicActionSheetService, 
    public Timeline) 
  {
    $scope.desayuno = Timeline.desayuno;
  }
  
  public cardDestroyed(index: number) {
    this.cards.splice(index, 1);
  }
  
  public cardSwiped(index: number) {
    // TODO: instanciar una carta
    let newCard = undefined;
    this.cards.push(newCard);
  }
  
  public showActionsheet(plato) {
    let title = ""
    if(plato) {
      title = plato.name;
      this.$ionicActionSheet.show({
        titleText: title,
        buttons: [
          { text: '<i class="icon ion-arrow-move"></i>Cantidades' },
          { text: '<i class="icon ion-arrow-move"></i>Sustituir' }
        ],
        destructiveText: '<i class="icon ion-share"></i>Quitar',
        cancelText: "Cancel",
        cancel: () => {
          console.log('CANCELLED');
        },
        buttonClicked: (index: number) => {
          console.log('BUTTON CLICKED', index);
          return true;
        },
        destructiveButtonClicked: () => {
          console.log('DESTRUCT');
          return true;
        }
      });
    }
    
  }
}

angular.module('starter.controllers', [])

.controller('DashCtrl', DashController)

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

.controller('SignInCtrl', function($scope, $state, $q, $location, Login) {
  
  var promise = initiatePushPlugin($q, $state);
  if (promise)
    promise.then(function(token){
      $scope.pushToken = token;
    })

  $scope.signIn = function(user) {
    Login.formLogin(user).then(function(data){
      console.log('Sign-In', user);
      $state.go('tab.dash');
    })    
  };
  $scope.showHelp = function(tipo) {
    if (!tipo)
        tipo = ''
    console.log("Show Help: ", tipo);
    $state.go('help'+tipo, {startpage: 0});
  };
  $scope.trackFood = function() {
    $state.go('trackfood');
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
.controller('TrackCtrl', function($scope, $state, $stateParams, $ionicHistory, FoodSearch) {
    $scope.data = {
      "plates" : [],
      "search" : ''
    };
    $scope.search = function() {
      console.log("Searching...", $scope.data.search);
      FoodSearch.plateByName($scope.data.search).then(function(matches) {
        $scope.data.plates = matches.data.hits.hits;
      });
    }
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };
/*
    $scope.search().promise.then(function(rest) {
      console.log("HITS: ", rest.data.hits.hits);
      $scope.data.plates = rest.data.hits.hits;
      console.log("PLATES: ", $scope.data.plates);
    });
*/
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
