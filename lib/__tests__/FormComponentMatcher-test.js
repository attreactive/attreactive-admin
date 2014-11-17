/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var FormComponentMatcher = require("../FormComponentMatcher");

describe('FormComponentMatcher', function() {
  it('should match component', function() {
    var formComponentMatcher = new FormComponentMatcher();
    var a = jest.genMockFn();
    var b = jest.genMockFn();

    formComponentMatcher.registerComponent('a', a);
    formComponentMatcher.registerComponent('b', b);

    expect(formComponentMatcher.match('a')).toBe(a);
    expect(formComponentMatcher.match('b')).toBe(b);
    expect(formComponentMatcher.match('c')).toBeNull();
  });
});
