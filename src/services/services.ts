angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Timeline', function() {
  return {
    init: function($scope, $sliderDelegate) {
      var setupSlider = function() {
        //some options to pass to our slider
        $scope.data.sliderOptions = {
          initialSlide: $scope.data.currentPage,
          direction: 'horizontal', //or vertical
          speed: 250, //0.3s transition,
          shortSwipes: false
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
          if (newVal != null) {
            $scope.data.sliderDelegate.on('slideChangeEnd', function() {
              $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
              //use $scope.$apply() to refresh any content external to the slider
              $scope.$apply();
            });
          }
        });
      };

      setupSlider();
    },
    desayuno: function() {
      return [{name: 'Café con leche', info: '245 Kcal'},
              {name: 'Tostada con mermelada', info: '250 Kcal'},
              {name: 'Zumo de naranja', info: '10 Kcal'}
      ];
    }
  }

})

.factory('Help', function() {
  return {
    loadPages: function($scope, $ionicNavBarDelegate) {
      //$ionicNavBarDelegate.title('Cómo funciona Nire...');

      for (var i = 0; i < 5; i++) {
        $scope.data.bgColors.push("bgColor_" + i);
      }

      var setupSlider = function() {
        //some options to pass to our slider
        $scope.data.sliderOptions = {
          initialSlide: $scope.data.currentPage,
          direction: 'horizontal', //or vertical
          speed: 250 //0.3s transition
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
          if (newVal != null) {
            $scope.data.sliderDelegate.on('slideChangeEnd', function() {
              $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
              //use $scope.$apply() to refresh any content external to the slider
              $scope.$apply();
            });
          }
        });
      };

      setupSlider();
    }
  }
})

.factory('FoodSearch', function($http, $q) {
  //
  // http://search.nire.co/contenidos_es_es/_search?q=name:*Ibup**&fields=id,name&sort=_score:asc
  //
  return {
    plateByName: function(queryText) {
      var rdo = $q.defer();
      var query = "http://search.nire.co/platos_es_co/_search?q=nombredieta:*" + queryText + "**&fields=id,nombredieta&sort=_score:asc"
      $http.get(query)
        .then(function(res) {
          console.log("RES: ", res);
          rdo.resolve(res);
        }).catch(function(data, status) {
          console.error('Gists error', data, status);
        })
        .finally(function() {
          console.log("finally finished gists");
        });
      return rdo.promise;
    }
  }
})

;
