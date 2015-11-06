'use strict';

describe('Controller: BlogMgmtCtrl', function () {

  // load the controller's module
  beforeEach(module('gripirBlogApp'));

  var BlogMgmtCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BlogMgmtCtrl = $controller('BlogMgmtCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
