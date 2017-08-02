(function () {
  'use strict';

  angular
    .module('rooms.admin')
    .controller('RoomsAdminController', RoomsAdminController);

  RoomsAdminController.$inject = ['$scope', '$state', '$window', 'roomResolve', 'AdminService', '$filter', 'Authentication', 'Notification'];

  function RoomsAdminController($scope, $state, $window, room, AdminService, $filter, Authentication, Notification) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.addUser  = addUser;
    vm.deleteP = deleteP;
    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    function addUser(user) {
      for (var i = vm.room.participants.length - 1; i >= 0; i--) {
        if(vm.room.participants[i].user.username == user.username){
          console.log('Existing');
          return false;
        }
      }
        vm.room.newUser = user.username;
        vm.room.createOrUpdate();
    }

    function deleteP(participant) {
      vm.room.deleteUser = participant.user.username;
      vm.room.createOrUpdate();
    }


    vm.room = room;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.update = update;
    vm.save = save;
    vm.changerole = changerole;
    // Remove existing room
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.room.$remove(function() {
          $state.go('admin.rooms.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> room deleted successfully!' });
        });
      }
    }

    // Save room
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.roomForm');
        return false;
      }

      // Create a new room, or update the current instance
      vm.room.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.room', {
          roomId: room._id
        });
        
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> room saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> room save error!' });
      }
    }


    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }
    function changerole(participant){
      if(participant.roles[0] == 'student'){
        participant.roles[0] = 'teacher';
      } else {
        participant.roles[0] = 'student';
      }
      vm.room.changerole = participant.user.username;
      vm.room.createOrUpdate();
    }
  }
}());
