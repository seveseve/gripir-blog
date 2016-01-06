'use strict';

angular.module('gripirBlogApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.activities = [];

    $http.get('/api/activities').success(function(activities) {
      $scope.activities = activities.reverse();;
      socket.syncUpdates('activity', $scope.activities);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('activity');
    });
  });
