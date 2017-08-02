(function () {
  'use strict';

  angular
    .module('rooms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Rooms',
      state: 'rooms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rooms', {
      title: 'List Rooms',
      state: 'rooms.list',
      roles: ['*']
    });
  }
}());
