(function () {
  'use strict';

  angular
    .module('rooms.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rooms', {
        abstract: true,
        url: '/rooms',
        template: '<ui-view/>'
      })
      .state('rooms.list', {
        url: '',
        templateUrl: '/modules/rooms/client/views/list-rooms.client.view.html',
        controller: 'RoomsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rooms List'
        }
      })
      .state('rooms.view', {
        url: '/:roomId',
        templateUrl: '/modules/rooms/client/views/view-room.client.view.html',
        controller: 'RoomsController',
        controllerAs: 'vm',
        resolve: {
          roomResolve: getRoom
        },
        data: {
          pageTitle: 'Room {{ roomResolve.title }}'
        }
      });
  }

  getRoom.$inject = ['$stateParams', 'RoomsService'];

  function getRoom($stateParams, RoomsService) {
    return RoomsService.get({
      roomId: $stateParams.roomId
    }).$promise;
  }
}());
