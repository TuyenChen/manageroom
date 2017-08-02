(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('rooms.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Rooms',
      state: 'admin.rooms.list'
    });
  }
}());
