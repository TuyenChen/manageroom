(function () {
  'use strict';

  angular
    .module('rooms.admin')
    .controller('RoomsAdminListController', RoomsAdminListController);

  RoomsAdminListController.$inject = ['RoomsService'];

  function RoomsAdminListController(RoomsService) {
    var vm = this;

    vm.rooms = RoomsService.query();
  }
}());
