// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'ui.router',
    'lbServices',
    'ui.bootstrap'
  ])
  .filter('searchFor', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

      if (!searchString) {
        return arr;
      }
      var result = [];
      searchString = searchString.toLowerCase();
      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function (item) {
        if (item.toLowerCase().indexOf(searchString) !== -1) {
          result.push(item);
        }
      });
      return result;
    };
  })
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider,
    $urlRouterProvider, $httpProvider) {
    // 处理没有权限的请求
    $httpProvider.interceptors.push(function ($q, $location, LoopBackAuth) {
      return {
        responseError: function (rejection) {
          if (rejection.status == 401) {
            // Clearing the loopback values from client browser for safe logout...
            LoopBackAuth.clearUser();
            LoopBackAuth.clearStorage();
            $location.nextAfterLogin = $location.path();
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    });
    // 声明路由
    $stateProvider
      .state('add-review', {
        url: '/add-review',
        templateUrl: 'views/review-form.html',
        controller: 'AddReviewController',
        authenticate: true
      })
      .state('all-reviews', {
        url: '/all-reviews',
        templateUrl: 'views/all-reviews.html',
        controller: 'AllReviewsController'
      })
      .state('edit-review', {
        url: '/edit-review/:id',
        templateUrl: 'views/review-form.html',
        controller: 'EditReviewController',
        authenticate: true
      })
      .state('delete-review', {
        url: '/delete-review/:id',
        controller: 'DeleteReviewController',
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/main.html'
      })
      .state('phenotype', {
        url: '/phenotype',
        templateUrl: 'views/phenotype.html',
        controller: 'PhenotypeController'
      })
      .state('gene_region', {
        url: '/gene_region',
        templateUrl: 'views/gene_region.html',
        controller: 'Gene_regionController'
      })
      .state('marker', {
        url: '/marker',
        templateUrl: 'views/marker.html',
        controller: 'MarkerController'
      })
      .state('pathway', {
        url: '/pathway',
        templateUrl: 'views/pathway.html'
      })
      .state('browser', {
        url: '/browser',
        templateUrl: 'views/browser.html'
      });
    $urlRouterProvider.otherwise('main');
  }])
  .run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // 判断用户token是否有效
      if (AuthService.isAuthenticated()) {
        AuthService.getUserLoginInfo()
      }
      // redirect to login page if not logged in
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('forbidden');
      }
    });
  }]);
