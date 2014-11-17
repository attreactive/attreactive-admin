/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var PropertyStringifier = require("../PropertyStringifier");

describe('PropertyStringifier', function() {
  it('should stringify object using property', function() {
    var stringifier = new PropertyStringifier('name');

    var wrap = function(object) {
      return function() {
        stringifier.stringify(object);
      };
    };

    expect(stringifier.stringify({name: 'admin'})).toEqual('admin');
    expect(wrap({name: function() {}})).toThrow('Invalid property value');
    expect(wrap({})).toThrow('Invalid property value');
    expect(wrap(null)).toThrow('Invalid property value');
  });
});
