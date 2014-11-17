/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();
jest.mock('../../storage/RestStorage')

var AdminResource = require("../AdminResource");
var AdminResourceProperty = require("../AdminResourceProperty");
var RestStorage = require("../../storage/RestStorage");
var PropertyStringifier = require("../../stringifier/PropertyStringifier");

describe('AdminResource', function() {
  it('should work', function() {
    var storage = new RestStorage();
    var stringifier = new PropertyStringifier('name');

    var resource = new AdminResource(
      'users',
      'Users',
      storage,
      stringifier
    );

    expect(resource.getId()).toEqual('users');
    expect(resource.getTitle()).toEqual('Users');
    expect(resource.getStorage()).toBe(storage);
    expect(resource.getStringifier()).toBe(stringifier);
    expect(resource.getMetadata()).toEqual({});
    expect(resource.getIdProperty()).toEqual('id');
    expect(resource.getProperties()).toEqual([]);
    expect(resource.getListingProperties()).toEqual([]);
    expect(resource.getViewProperties()).toEqual([]);
    expect(resource.getListingUrl()).toEqual('/users/');
    expect(resource.getViewUrl({id: 1})).toEqual('/users/1');
    expect(resource.stringify({name: 'a'})).toEqual('a');

    resource.setMetadata({a: 1});
    resource.setIdProperty('_id');

    var listingProp = {
      getId: jest.genMockFn().mockReturnValue('listing'),
      isVisibleInListing: jest.genMockFn().mockReturnValue(true),
      isVisibleInView: jest.genMockFn().mockReturnValue(false),
      isVisibleInForm: jest.genMockFn().mockReturnValue(false),
      getValidationConstraints: jest.genMockFn().mockReturnValue(null),
      getErrorMessages: jest.genMockFn().mockReturnValue(null)
    };
    var viewProp = {
      getId: jest.genMockFn().mockReturnValue('view'),
      isVisibleInListing: jest.genMockFn().mockReturnValue(false),
      isVisibleInView: jest.genMockFn().mockReturnValue(true),
      isVisibleInForm: jest.genMockFn().mockReturnValue(false),
      getValidationConstraints: jest.genMockFn().mockReturnValue(null),
      getErrorMessages: jest.genMockFn().mockReturnValue(null)
    };
    var formProp = {
      getId: jest.genMockFn().mockReturnValue('form'),
      isVisibleInListing: jest.genMockFn().mockReturnValue(false),
      isVisibleInView: jest.genMockFn().mockReturnValue(false),
      isVisibleInForm: jest.genMockFn().mockReturnValue(true),
      getValidationConstraints: jest.genMockFn().mockReturnValue({
        notNull: 'notNull'
      }),
      getErrorMessages: jest.genMockFn().mockReturnValue({
        notNull: 'form notNull'
      })
    };

    resource.addProperty(listingProp);
    resource.addProperty(viewProp);
    resource.addProperty(formProp);

    expect(resource.getMetadata()).toEqual({a: 1});
    expect(resource.getIdProperty()).toEqual('_id');
    expect(resource.getViewUrl({id: 1, _id: 2})).toEqual('/users/2');
    expect(resource.getProperties()).toEqual([listingProp, viewProp, formProp]);
    expect(resource.getListingProperties()).toEqual([listingProp]);
    expect(resource.getViewProperties()).toEqual([viewProp]);
    expect(resource.getFormProperties()).toEqual([formProp]);
    expect(resource.getValidationConfiguration()).toEqual({
      form: {
        notNull: 'notNull'
      }
    });
    expect(resource.getErrorMessagesConfiguration()).toEqual({
      form: {
        notNull: 'form notNull'
      }
    });
  });
});
