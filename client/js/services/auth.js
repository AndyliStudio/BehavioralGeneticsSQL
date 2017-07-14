// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', function (User, $q,
    $rootScope) {

    function isAuthenticated() {
      return User.
        isAuthenticated()
    }

    function getUserLoginInfo() {
      return User.
        getCurrent()
        .$promise
        .then(function (response) {
          $rootScope.currentUser = {
            id: response.id,
            tokenId: '',
            username: response.username,
            email: response.email
          };
          $rootScope.logout = logout;
        });
    }

    function login(email, password) {
      return User
        .login({ rememberMe: true }, { email: email, password: password })
        .$promise
        .then(function (response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            username: response.user.username,
            email: email
          };
        });
    }

    function logout() {
      return User
        .logout()
        .$promise
        .then(function () {
          $rootScope.currentUser = null;
        });
    }

    function register(email, password) {
      return User
        .create({
          email: email,
          password: password
        })
        .$promise;
    }

    function getsec(str) {
      alert(str);
      var str1 = str.substring(1, str.length) * 1;
      var str2 = str.substring(0, 1);
      if (str2 == "s") {
        return str1 * 1000;
      }
      else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
      }
      else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
      }
    }

    function getCookie(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    }

    function delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }

    function setCookie(name, value, time) {
      var strsec = getsec(time);
      var exp = new Date();
      exp.setTime(exp.getTime() + strsec * 1);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      getUserLoginInfo: getUserLoginInfo,
      getCookie: getCookie,
      setCookie: setCookie,
      delCookie: delCookie
    };
  }]);
