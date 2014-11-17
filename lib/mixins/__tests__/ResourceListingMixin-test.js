/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var ResourceListingMixin = require("../ResourceListingMixin");
var React = require("react/addons");
var $ = require("jquery");

var Listing = React.createClass({
  mixins: [ResourceListingMixin],

  render: function() {
    return React.DOM.div({});
  }
});

describe('ResourceListingMixin', function() {
  it('should work', function() {
    var storageReadAllPromise = $.Deferred();
    var storage = {
      readAll: jest.genMockFn().mockReturnValue(storageReadAllPromise)
    };
    var resource = {
      getStorage: jest.genMockFn().mockReturnValue(storage)
    };

    var listing = React.addons.TestUtils.renderIntoDocument(Listing({
      resource: resource
    }));

    expect(storage.readAll).toBeCalled();

    storageReadAllPromise.resolve([{name: 'admin'}, {name: 'bob'}]);

    expect(listing.state.loading).toBeFalsy();
    expect(listing.state.items).toEqual([{name: 'admin'}, {name: 'bob'}]);

    expect(listing.getFilteredItems()).toEqual([{name: 'admin'}, {name: 'bob'}]);
    listing.setState({filter: 'a'});
    expect(listing.getFilteredItems()).toEqual([{name: 'admin'}]);
    listing.setState({filter: 'b'});
    expect(listing.getFilteredItems()).toEqual([{name: 'bob'}]);
    listing.setState({filter: 'c'});
    expect(listing.getFilteredItems()).toEqual([]);
    listing.setState({filter: ''});
    expect(listing.getFilteredItems()).toEqual([{name: 'admin'}, {name: 'bob'}]);
  });
});
