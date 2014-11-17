/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var AdminResourceProperty = require("../AdminResourceProperty");
var StringFormatter = require("../../formatter/StringFormatter");

describe('AdminResourceProperty', function() {
  it('should work', function() {
    var formatter = new StringFormatter();
    var validationConstraints = {notBlank: jest.genMockFn()};
    var errorMessages = {notBlank: 'prop notBlank'};
    var component = jest.genMockFn();

    var prop = new AdminResourceProperty(
      'id',
      'title',
      formatter,
      validationConstraints,
      errorMessages,
      component
    );

    expect(prop.getId()).toEqual('id');
    expect(prop.getTitle()).toEqual('title');
    expect(prop.getFormatter()).toBe(formatter);
    expect(prop.getValidationConstraints()).toBe(validationConstraints);
    expect(prop.getErrorMessages()).toBe(errorMessages);
    expect(prop.getComponent()).toBe(component);
    expect(prop.getDefaultValue()).toBeNull();
    expect(prop.isVisibleInListing()).toEqual(true);
    expect(prop.isVisibleInView()).toEqual(true);
    expect(prop.isVisibleInForm()).toEqual(true);
    expect(prop.isLinkable()).toEqual(false);
    expect(prop.getMetadata()).toEqual({});

    prop.setDefaultValue('default');
    prop.setVisibleInListing(false);
    prop.setVisibleInView(false);
    prop.setVisibleInForm(false);
    prop.setLinkable(true);
    prop.setMetadata({a: 1});

    expect(prop.getDefaultValue()).toEqual('default');
    expect(prop.isVisibleInListing()).toEqual(false);
    expect(prop.isVisibleInView()).toEqual(false);
    expect(prop.isVisibleInForm()).toEqual(false);
    expect(prop.isLinkable()).toEqual(true);
    expect(prop.getMetadata()).toEqual({a: 1});

    expect(prop.readFormattedValue({id: '123'})).toEqual('123');
  });
});
