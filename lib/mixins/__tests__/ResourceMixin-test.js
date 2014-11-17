/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var ResourceMixin = require("../ResourceMixin");

describe('ResourceMixin', function() {
  it('should work', function() {
    var resource = {
      getTitle: jest.genMockFn().mockReturnValue('getTitle'),
      getListingUrl: jest.genMockFn().mockReturnValue('getListingUrl'),
      getViewUrl: jest.genMockFn().mockReturnValue('getViewUrl'),
      getListingProperties: jest.genMockFn().mockReturnValue('getListingProperties'),
      getViewProperties: jest.genMockFn().mockReturnValue('getViewProperties'),
      getFormProperties: jest.genMockFn().mockReturnValue('getFormProperties'),
      getMetadata: jest.genMockFn().mockReturnValue('getMetadata'),
    };

    ResourceMixin.props = { resource: resource };

    expect(ResourceMixin.getTitle()).toEqual('getTitle');
    expect(ResourceMixin.getListingUrl()).toEqual('getListingUrl');
    expect(ResourceMixin.getViewUrl()).toEqual('getViewUrl');
    expect(ResourceMixin.getListingProperties()).toEqual('getListingProperties');
    expect(ResourceMixin.getViewProperties()).toEqual('getViewProperties');
    expect(ResourceMixin.getFormProperties()).toEqual('getFormProperties');
    expect(ResourceMixin.getMetadata()).toEqual('getMetadata');
  });
});
