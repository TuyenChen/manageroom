(function () {
  'use strict';

  angular
    .module('rooms')
    .controller('RoomsController', RoomsController);

  RoomsController.$inject = ['$scope', 'roomResolve', 'Authentication'];

  function RoomsController($scope, room, Authentication) {
    var vm = this;

    vm.room = room;
    vm.authentication = Authentication;

  }
}());
