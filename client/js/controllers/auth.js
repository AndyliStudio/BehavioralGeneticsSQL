// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AuthLoginController', ['$scope', 'AuthService', '$state', '$location',
    function ($scope, AuthService, $state, $location) {
      $scope.user = {
        email: 'andyliwr@outlook.com',
        password: '123456'
      };

      $scope.login = function () {
        AuthService.login($scope.user.email, $scope.user.password)
          .then(function () {
            // $state.go('main');
            var next = $location.nextAfterLogin || '/main';
            $location.nextAfterLogin = null;
            $location.path(next);
          });
      };
    }])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      AuthService.logout()
        .then(function () {
          $state.go('all-reviews');
        });
    }])
  .controller('SignUpController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      $scope.user = {
        email: '',
        username: '',
        password: '',
        comfimPassword: '',
        organization: '',
        country: '',
      };

      $scope.register = function () {
        AuthService.register($scope.user.email, $scope.user.password)
          .then(function () {
            $state.transitionTo('sign-up-success');
          });
      };
    }])
  .controller('MarkerController', ['$scope', 'Snp_info', '$state',
    function ($scope, Snp_info, $state) {
      $scope.sstr = ''
      $scope.suggests = []
      $scope.thisMarker = {}
      $scope.isShowTable = false
      $scope.isShowSuggest = false
      $scope.searchMarker = function () {
        $scope.isShowSuggest = true
        Snp_info.find({ filter: { where: { marker: { like: "%" + $scope.sstr + "%" } }, fields: { marker: true, id: true } } })
          .$promise
          .then(function (res) {
            if (res instanceof Array) {
              res.forEach(item => {
                if ($scope.suggests.length < 10) {
                  $scope.suggests.push({ id: item.id, text: item.marker })
                }
              })
            }
          })
      };
      $scope.showMarker = function (id, marker) {
        $scope.sstr = marker
        Snp_info.find({ filter: { where: { id: id } } })
          .$promise
          .then(function (res) {
            $scope.isShowSuggest = false
            $scope.isShowTable = true
            $scope.thisMarker = res[0]
          })
      };
    }]);
