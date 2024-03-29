(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$q', 'toastr', 'logger', '$state', '$cookieStore', 'authService', 'helperService'];
  /* @ngInject */
  function AuthController($q, toastr, logger, $state, $cookieStore, authService, helperService) {
    var vm = this;
    vm.title = 'Login';
    vm.login = login;
    vm.resetPassword = resetPassword;
    vm.setBarNameAndTransition = setBarNameAndTransition;
    vm.errorMessage;
    vm.infoMessage;

    function login(credentials) {
      authService.login(credentials).then(function(user) {
        vm.setBarNameAndTransition();
      }, function(error) {
        vm.errorMessage = true;
      });
    }

    function resetPassword(credentials) {
      authService.resetPassword(credentials).then(function() {
        vm.infoMessage = true;
      }, function() {
        vm.infoMessage = true;
      });
    }

    function setBarNameAndTransition() {
      helperService.getCurrentUsersBar().then(function(result) {
        // TODO: Maybe move to localStorage instead of a cookie
        $cookieStore.put('bar-name', result.data ? result.data.name : '');
        $state.go('dashboard');
      });
    }
  }
})();
