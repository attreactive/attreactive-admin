/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var DateFormatter = require("../DateFormatter");

describe('DateFormatter', function() {
  it('should format date', function() {
    var formatter = new DateFormatter();

    expect(formatter.format('2014-09-10T12:16:39+0000')).toEqual('10.09.2014 12:16:39');
    expect(formatter.format(null)).toEqual('Invalid date');
    expect(formatter.format({})).toEqual('Invalid date');
  });
});
