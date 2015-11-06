'use strict';

angular.module('gripirBlogApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('blog-mgmt', {
        url: '/admin/blog-mgmt',
        templateUrl: 'app/admin/blog-mgmt/blog-mgmt.html',
        controller: 'BlogMgmtCtrl',
        authenticate: true,
        mustBeAdmin: true
      });
  });