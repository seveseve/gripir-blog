'use strict';

describe('Controller: UserMgmtCtrl', function () {

  // load the controller's module
  beforeEach(module('gripirBlogApp'));

  var UserMgmtCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserMgmtCtrl = $controller('UserMgmtCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
