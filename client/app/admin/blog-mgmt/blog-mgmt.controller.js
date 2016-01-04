'use strict';

angular.module('gripirBlogApp')
  .controller('BlogMgmtCtrl', function ($scope, $http, Modal, socket, notify) {

    $scope.activities = [];
    $scope.creating = false;

    $scope.filteredActivities = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 3;

    var updateActivities = function() {
      $http.get('/api/activities')
        .success(function(activities) {
          $scope.activities = activities;
          socket.syncUpdates('activity', $scope.activities);
        
          var begin = (($scope.currentPage - 1) * $scope.numPerPage);
          var end = begin + $scope.numPerPage;
          $scope.filteredActivities = $scope.activities.slice(begin, end);
        });
    };

    updateActivities();

    $scope.pageChanged = function() {
      updateActivities();
    };

    $scope.selectActivity = function(activity) {
      $scope.creating = false;
      $scope.selectedActivity = {
        id: activity._id,
        text: activity.text,
        title: activity.title,
        author: activity.author
      }
    };

    $scope.unselect = function() {
      $scope.creating = false;
      $scope.selectedActivity = null;
    };

    $scope.showCreateForm = function () {
      $scope.creating = true;
    };

    $scope.createNew = function () {
      $http.post('/api/activities', {
        text: $scope.selectedActivity.text,
        title: $scope.selectedActivity.title,
        author: $scope.selectedActivity.author
      }).success(function () {
        notify({ message: 'Created!', duration: 2000, classes: ["alert-success"] });
        $scope.creating = false;
        $scope.selectedActivity = null;
        updateActivities();
      });
    };

    $scope.updateSelected = function() {
      $http.put('/api/activities/' + $scope.selectedActivity.id, {
        text: $scope.selectedActivity.text,
        title: $scope.selectedActivity.title,
        author: $scope.selectedActivity.author
      }).success(function () {
        notify({ message: 'Updated!', duration: 2000, classes: ["alert-success"] });
        updateActivities();
      });
    };

    $scope.deleteActivity = Modal.confirm.delete(function() {
      $http.delete('/api/activities/' + $scope.selectedActivity.id)
      .success(function () {
        notify({ message: 'Removed!', duration: 2000, classes: ["alert-success"] });
        $scope.unselect();
        updateActivities();
      }); 
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('activity');
    });
  });
