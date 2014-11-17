/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var StringFormatter = require("../StringFormatter");

describe('StringFormatter', function() {
  it('should format string', function() {
    var formatter = new StringFormatter();

    expect(formatter.format('test')).toEqual('test');
    expect(formatter.format(null)).toEqual('Invalid string');
    expect(formatter.format({})).toEqual('Invalid string');
  });
});
