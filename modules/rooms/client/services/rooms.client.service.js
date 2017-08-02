(function () {
  'use strict';

  angular
    .module('rooms.services')
    .factory('RoomsService', RoomsService);

  RoomsService.$inject = ['$resource', '$log'];

  function RoomsService($resource, $log) {
    var Room = $resource('/api/rooms/:roomId', {
      roomId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Room.prototype, {
      createOrUpdate: function () {
        var room = this;
        return createOrUpdate(room);
      }
    });

    return Room;

    function createOrUpdate(room) {
      if (room._id) {
        return room.$update(onSuccess, onError);
      } else {
        return room.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(room) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
