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
          }).catch(function (err) {
            alert('用户名或者密码错误');
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
    }])
  .controller('PhenotypeController', ['$scope', 'Snp_info', '$state',
    function ($scope, Snp_info, $state) {
      $scope.sstr = ''
      $scope.pValue = '0.00000008942450418520821'
      $scope.suggests = []
      $scope.allSnps = []
      $scope.showingSnps = []
      $scope.isShowTable = false
      $scope.isShowSuggest = false
      $scope.currentPage = 0
      $scope.totalItems = 0
      $scope.isSelectAll = false
      $scope.convertFloat = function (str) {
        let regExp = /^\d+(\.)*\d+[Ee]{1}(-)*\d+$/ig
        if (regExp.test(str)) {
          let num = parseFloat(str.substring(0, str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)))
          let exc = parseInt(str.substring((str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)) + 1))
          return num * Math.pow(10, exc)
        } else {
          return parseFloat(str)
        }
      }
      $scope.searchTrait = function () {
        $scope.isShowSuggest = true
        Snp_info.find({ filter: { where: { trait: { like: "%" + $scope.sstr + "%" } }, fields: { trait: true } } })
          .$promise
          .then(function (res) {
            if (res instanceof Array) {
              res.forEach(item => {
                // 判断item.trait是不是在suggests中存在，不存在则添加
                let hasExist = $scope.suggests.some(suggest => {
                  return suggest === item.trait
                })
                if (!hasExist) {
                  $scope.suggests.push(item.trait)
                }
              })
            }
          })
      }
      $scope.showTrait = function (trait) {
        $scope.sstr = trait
        Snp_info.find({ filter: { where: { trait: trait, p: { gte: $scope.convertFloat($scope.pValue.toString()) } } } })
          .$promise
          .then(function (res) {
            $scope.isShowSuggest = false
            $scope.isShowTable = true
            $scope.totalItems = res.length || 0
            $scope.showingSnps = res.splice(0, 10)
            $scope.allSnps = res.map(item => {
              item.isChecked = false
              return item;
            })
          })
      }
      $scope.pageChanged = function () {
        $scope.showingSnps = $scope.allSnps.splice($scope.currentPage * 10, 10)
      }
    }]);
