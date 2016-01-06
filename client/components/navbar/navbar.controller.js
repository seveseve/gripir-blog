'use strict';

angular.module('gripirBlogApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'blog',
      'link': '/'
    }];

    $scope.adminMenu = [{
      'title': 'user management',
      'link': '/admin/user-mgmt'
      },
    {
      'title': 'blog management',
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