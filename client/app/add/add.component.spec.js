'use strict';

describe('Component: AddComponent', function() {
  // load the controller's module
  beforeEach(module('cmsApp.add'));

  var AddComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AddComponent = $componentController('add', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
