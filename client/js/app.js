// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'ui.router',
    'lbServices',
    'ui.bootstrap',
    'ngMap'
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
      .state('contact-us', {
        url: '/contact',
        templateUrl: 'views/countact-us.html',
        controller: 'ContactUsController',
        authenticate: true
      })
      .state('help', {
        url: '/help',
        templateUrl: 'views/countact-us.html',
        controller: 'ContactUsController'
      })
      .state('team', {
        url: '/team',
        templateUrl: 'views/countact-us.html',
        controller: 'ContactUsController'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'views/countact-us.html',
        controller: 'ContactUsController'
      })
    $urlRouterProvider.otherwise('main');
  }])
  .run(['$rootScope', '$state', 'AuthService', '$location', function ($rootScope, $state, AuthService, $location) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // 判断用户token是否有效
      if (AuthService.isAuthenticated() && AuthService.getCookie('access_token')) {
        AuthService.getUserLoginInfo()
      } else {
        if (next.authenticate) {
          event.preventDefault(); //prevent current page from loading
          $location.nextAfterLogin = next.url;
          $state.go('login');
        }
      }
    });
  }]);
