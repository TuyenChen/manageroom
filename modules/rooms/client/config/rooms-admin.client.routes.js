(function () {
  'use strict';

  angular
    .module('rooms.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.rooms', {
        abstract: true,
        url: '/rooms',
        template: '<ui-view/>'
      })
      .state('admin.rooms.list', {
        url: '',
        templateUrl: '/modules/rooms/client/views/admin/list-rooms.client.view.html',
        controller: 'RoomsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.rooms.create', {
        url: '/create',
        templateUrl: '/modules/rooms/client/views/admin/form-room.client.view.html',
        controller: 'RoomsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          roomResolve: newRoom
        }
      })
      .state('admin.room', {
        url: '/rooms/:roomId',
        templateUrl: '/modules/rooms/client/views/admin/view-room.client.view.html',
        controller: 'RoomsAdminController',
        controllerAs: 'vm',
        resolve: {
          roomResolve: getRoom
        },
        data: {
          pageTitle: 'Edit {{ roomResolve.name }}'
        }
      })
      .state('admin.rooms.edit', {
        url: '/:roomId/edit',
        templateUrl: '/modules/rooms/client/views/admin/form-room.client.view.html',
        controller: 'RoomsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          roomResolve: getRoom
        }
      });
  }

  getRoom.$inject = ['$stateParams', 'RoomsService'];

  function getRoom($stateParams, RoomsService) {
    return RoomsService.get({
      roomId: $stateParams.roomId
    }).$promise;
  }

  getRoomUsers.$inject = ['$stateParams', 'Room_usersService'];

  function getRoomUsers($stateParams, Room_usersService) {
    return Room_usersService.get({
      room_usersId: $stateParams.roomId
    }).$promise;
  }

  newRoom.$inject = ['RoomsService'];

  function newRoom(RoomsService) {
    return new RoomsService();
  }
}());
