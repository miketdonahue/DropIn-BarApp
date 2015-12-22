(function() {
  'use strict';

  angular
    .module('app.users')
    .run(appRun);

  appRun.$inject = ['routerHelper', 'ROLES'];
  /* @ngInject */
  function appRun(routerHelper, ROLES) {
    routerHelper.configureStates(getStates(ROLES));
  }

  function getStates(ROLES) {
    return [
      {
        state: 'users',
        config: {
          url: '/users',
          templateUrl: 'app/users/list.html',
          controller: 'UserController',
          controllerAs: 'vm',
          title: 'Users',
          data: {
            authorizedRoles: [ROLES.admin]
          }
        }
      },
      {
        state: 'user-new',
        config: {
          url: '/users/new',
          templateUrl: 'app/users/new.html',
          controller: 'UserController',
          controllerAs: 'vm',
          title: 'User',
          data: {
            authorizedRoles: [ROLES.admin]
          }
        }
      }
    ];
  }
})();