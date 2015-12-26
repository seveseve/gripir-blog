'use strict';

angular.module('gripirBlogApp')
  .controller('BlogMgmtCtrl', function ($scope, $http, Modal, socket, notify) {
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

    $scope.selectActivity = function(activity) {
      $scope.selectedActivity = {
        id: activity._id,
        text: activity.text,
        title: activity.title,
        author: activity.author
      }
    };

    $scope.unselect = function() {
      $scope.selectedActivity = null;
    };

    $scope.updateSelected = function() {
      $http.put('/api/activities/' + $scope.selectedActivity.id, {
        text: $scope.selectedActivity.text,
        title: $scope.selectedActivity.title,
        author: $scope.selectedActivity.author
      });
      notify({ message: 'Updated!', duration: 2000, classes: ["alert-success"] });
    };

    $scope.deleteActivity = Modal.confirm.delete(function() {
      $http.delete('/api/activities/' + $scope.selectedActivity.id);
      notify({ message: 'Removed!', duration: 2000, classes: ["alert-success"] });
      $scope.unselect();
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('activity');
    });
  });
