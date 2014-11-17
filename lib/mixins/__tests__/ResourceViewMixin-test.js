/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var ResourceViewMixin = require("../ResourceViewMixin");
var React = require("react/addons");
var $ = require("jquery");

var View = React.createClass({
  mixins: [ResourceViewMixin],

  render: function() {
    return React.DOM.div({});
  }
});

describe('ResourceViewMixin', function() {
  it('should work', function() {
    var storageReadOnePromise = $.Deferred();
    var storageDeletePromise = $.Deferred();
    var storage = {
      readOne: jest.genMockFn().mockReturnValue(storageReadOnePromise),
      delete: jest.genMockFn().mockReturnValue(storageDeletePromise)
    };
    var resource = {
      getStorage: jest.genMockFn().mockReturnValue(storage),
      stringify: jest.genMockFn().mockImpl(function(item) { return item.name; })
    };

    var view = React.addons.TestUtils.renderIntoDocument(View({
      resource: resource,
      id: 123
    }));

    expect(storage.readOne).toBeCalledWith(123);

    expect(view.getItemTitle()).toEqual('—');

    storageReadOnePromise.resolve({name: 'admin'});

    expect(view.state.loading).toBeFalsy();
    expect(view.state.item).toEqual({name: 'admin'});

    expect(view.getItemTitle()).toEqual('admin');

    view.deleteItem();

    expect(storage.delete).toBeCalledWith(123);

    expect(view.state.loading).toBeTruthy();

    storageDeletePromise.reject();

    expect(view.state.loading).toBeFalsy();
    expect(view.state.error).toBeTruthy();
  });
});
