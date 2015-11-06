'use strict';

angular.module('gripirBlogApp')
  .controller('BlogMgmtCtrl', function ($scope, $http, socket) {
    $scope.activities = [];

    $http.get('/api/activities').success(function(activities) {
      $scope.activities = activities;
      socket.syncUpdates('activity', $scope.activities);
    });

    $scope.addActivity = function() {
      if($scope.newActivity === '') {
        return;
      }
      $http.post('/api/activities', { name: $scope.newActivity });
      $scope.newActivity = '';
    };

    $scope.deleteActivity = function(activity) {

      // TODO: Confirm dialog
      $http.delete('/api/activities/' + activity._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('activity');
    });
  });
