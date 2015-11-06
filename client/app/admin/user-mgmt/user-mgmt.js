'use strict';

angular.module('gripirBlogApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-mgmt', {
        url: '/admin/user-mgmt',
        templateUrl: 'app/admin/user-mgmt/user-mgmt.html',
        controller: 'UserMgmtCtrl',
        authenticate: true,
        mustBeAdmin: true
      });
  });