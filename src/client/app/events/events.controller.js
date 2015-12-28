(function () {
  'use strict';

  angular
    .module('app.events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$q', 'logger', '$state', '$stateParams', 'moment', 'eventService', 'helperService'];
  /* @ngInject */
  function EventsController($scope, $q, logger, $state, $stateParams, moment, eventService, helperService) {
    var vm = this;
    vm.title = 'Events';
    vm.eventId = $stateParams.id;
    vm.allEvents = allEvents;
    vm.createEvent = createEvent;
    vm.showEvent = showEvent;
    vm.updateEvent = updateEvent;
    vm.deleteEvent = deleteEvent;
    vm.getLoyaltyLevels = getLoyaltyLevels;
    vm.init = init;

    // Get photo object from form
    $scope.eventPhoto = function(photo) {
      vm.photo = photo.files[0];
      $scope.$apply();
    };

    function allEvents() {
      eventService.allEvents().then(function(results) {
        vm.allEvents = results.data;
      }, function(error) {
        // Error
      });
    }

    function createEvent(eventData) {
      // Convert dates to ISO string (local time)
      eventData.eventStart = moment(eventData.eventStart).format();
      eventData.eventEnd = moment(eventData.eventEnd).format();
      console.log(vm.photo);
      eventService.createEvent(eventData, vm.photo).then(function() {
        $state.go('events');
      }, function(error) {
        // Error
      });
    }

    function showEvent() {
      eventService.showEvent(vm.eventId).then(function(results) {
        vm.eventData = results.data;
      });
    }

    function updateEvent(eventData) {
      // Sets date from ng-model on edit template
      // Needed iso property on edit to get date string
      eventData.date = vm.eventData.date.iso;

      eventService.updateEvent(vm.eventId, eventData).then(function() {
        $state.go('events');
      });
    }

    function deleteEvent() {
      eventService.deleteEvent(vm.eventId).then(function() {
        $state.go('events');
      });
    }

    function getLoyaltyLevels() {
      helperService.getLoyaltyLevels().then(function(results) {
        vm.loyaltyLevels = results.data;
      });
    }

    function init() {
      vm.allEvents();
      vm.getLoyaltyLevels();

      if ($stateParams.id) {
        vm.showEvent();
      }
    }

    vm.init();
  }
})();
