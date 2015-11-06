'use strict';

angular.module('gripirBlogApp')
  .controller('AdminNavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'User Management',
      'link': '/admin/user-mgmt'
    },
    {
      'title': 'Blog Management',
      'link': '/admin/blog-mgmt'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });