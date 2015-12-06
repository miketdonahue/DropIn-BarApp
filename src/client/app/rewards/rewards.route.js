(function() {
  'use strict';

  angular
    .module('app.rewards')
    .run(appRun);

  appRun.$inject = ['routerHelper', 'ROLES'];
  /* @ngInject */
  function appRun(routerHelper, ROLES) {
    routerHelper.configureStates(getStates(ROLES));
  }

  function getStates(ROLES) {
    return [
      {
        state: 'rewards',
        config: {
          url: '/rewards',
          templateUrl: 'app/rewards/list.html',
          controller: 'RewardsController',
          controllerAs: 'vm',
          title: 'Rewards',
          data: {
            authorizedRoles: [ROLES.admin]
          }
        }
      },
      {
        state: 'reward-edit',
        config: {
          url: '/rewards/:id/edit',
          templateUrl: 'app/rewards/edit.html',
          controller: 'RewardsController',
          controllerAs: 'vm',
          title: 'Rewards',
          data: {
            authorizedRoles: [ROLES.admin]
          }
        }
      }
    ];
  }
})();
