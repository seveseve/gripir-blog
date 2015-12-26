'use strict';

angular.module('gripirBlogApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Blog',
      'link': '/'
    }];

    $scope.adminMenu = [{
      'title': 'User Management',
      'link': '/admin/user-mgmt'
      },
    {
      'title': 'Blog Management',
      'link': '/admin/blog-mgmt',
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });