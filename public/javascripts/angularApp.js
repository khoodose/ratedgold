angular.module('ratedGold', ['ui.router'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        providerPromise: ['providers', function(providers) {
          return providers.getAll();
        }]
      }
    })
    .state('providers', {
      url: '/providers/{id}',
      templateUrl: '/providers.html',
      controller: 'ProvidersCtrl',
      resolve: {
        provider: ['$stateParams', 'providers', function($stateParams, providers) {
          return providers.get($stateParams.id);
        }]
      }
    });

    $urlRouterProvider.otherwise('home');

  }])

.factory('providers', ['$http', function($http){
  var o = {
    providers: []
  };
  o.getAll = function() {
    return $http.get('/providers').success(function(data) {
      angular.copy(data, o.providers);
    });
  };

  o.get = function(id) {
    return $http.get('/providers/' + id).then(function(res) {
      return res.data;
    })
  }

  o.create = function(provider) {
    return $http.post('/providers', provider).success(function(data) {
      o.providers.push(data);
    });
  };

  o.upvote = function(provider) {
    return $http.put('/providers/' + provider._id + '/upvote').success(function(data) {
      provider.upvotes += 1;
    });
  };

  o.addReview = function(id, review) {
    return $http.post('/providers/' + id + '/reviews', review);
  };

  o.upvoteReview = function(provider, review) {
    return $http.put('/providers/' + provider._id + '/reviews/' + review._id + '/upvote').success(function(data) {
      review.upvotes += 1;
    })
  }

  return o;
}])

.controller('MainCtrl', [
  '$scope',
  'providers',
  function($scope, providers){
    $scope.test = "Here's a list of education providers!";

    $scope.providers = providers.providers;

    $scope.addProvider = function() {
      if(!$scope.name || $scope.name==="" ||!$scope.description || $scope.description==="") { return; }
      providers.create({
        name: $scope.name,
        link: $scope.link,
        description: $scope.description,
        category: $scope.category,
        imageUrl: $scope.imageUrl
      });
      $scope.name="";
      $scope.link="";
      $scope.description="";
      $scope.category="";
      $scope.imageUrl="";
    };

    $scope.incrementUpvotes = function(provider) {
      providers.upvote(provider);
    };
  }])

  .controller('ProvidersCtrl', [
    '$scope',
    '$stateParams',
    'providers',
    'provider',
    function($scope, $stateParams, providers, provider) {
      $scope.provider = provider;

      $scope.addReview = function() {
        if(!$scope.body || $scope.body==="") { return; }
        providers.addReview(provider._id, {
          body: $scope.body,
          author: 'user'
        }).success(function(review) {
          $scope.provider.reviews.push(review);
        });

        $scope.body ="";
      }

      $scope.incrementUpvotes = function(review) {
        providers.upvoteReview(provider, review);
      }

    }])
