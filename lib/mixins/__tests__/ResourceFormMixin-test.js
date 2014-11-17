/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var ResourceFormMixin = require("../ResourceFormMixin");
var React = require("react/addons");
var $ = require("jquery");

var Form = React.createClass({
  mixins: [ResourceFormMixin],

  render: function() {
    return React.DOM.div({});
  }
});

describe('ResourceFormMixin', function() {
  it('should work as creation form', function() {
    var component = jest.genMockFn().mockReturnValue('dom');
    var notEmpty = jest.genMockFn().mockImpl(function(i) { return i.length > 0; });
    var prop = {
      getId: jest.genMockFn().mockReturnValue('prop'),
      getDefaultValue: jest.genMockFn().mockReturnValue(''),
      getComponent: jest.genMockFn().mockReturnValue(component)
    };
    var storageCreatePromise = $.Deferred();
    var storage = {
      create: jest.genMockFn().mockReturnValue(storageCreatePromise)
    };
    var resource = {
      getStorage: jest.genMockFn().mockReturnValue(storage),
      getFormProperties: jest.genMockFn().mockReturnValue([prop]),
      getValidationConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: notEmpty
        }
      }),
      getErrorMessagesConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: 'prop notEmpty'
        }
      }),
      getViewUrl: jest.genMockFn().mockImpl(function(i) { return '/users/' + i.id; })
    };

    var form = React.addons.TestUtils.renderIntoDocument(Form({
      resource: resource
    }));

    expect(form.state).toEqual({
      newItem: true,
      loading: false,
      error: false,
      item: {
        prop: ''
      }
    });

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      prop: {
        invalid: true,
        valid: false,
        notEmpty: {
          invalid: true,
          valid: false
        }
      }
    });

    expect(form.getErrorMessages()).toEqual({
      prop: []
    });

    expect(form.renderControl(prop)).toEqual('dom');

    var componentProps = component.mock.calls[0][0];
    expect(componentProps.property).toBe(prop);
    expect(componentProps.resource).toBe(resource);
    expect(componentProps.valueLink.value).toEqual('');
    expect(componentProps.validity).toEqual({
      invalid: true,
      valid: false,
      notEmpty: {
        invalid: true,
        valid: false
      }
    });
    expect(componentProps.setErrorMessageInputBlured).toBeDefined();

    componentProps.valueLink.requestChange('a');

    expect(form.validity).toEqual({
      invalid: false,
      valid: true,
      prop: {
        invalid: false,
        valid: true,
        notEmpty: {
          invalid: false,
          valid: true
        }
      }
    });

    componentProps.valueLink.requestChange('');

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      prop: {
        invalid: true,
        valid: false,
        notEmpty: {
          invalid: true,
          valid: false
        }
      }
    });

    expect(form.getErrorMessages()).toEqual({
      prop: []
    });

    componentProps.setErrorMessageInputBlured();

    expect(form.getErrorMessages()).toEqual({
      prop: ['prop notEmpty']
    });

    componentProps.valueLink.requestChange('a');

    form.save();

    expect(form.state.loading).toBeTruthy();
    expect(storage.create).toBeCalledWith(null, {
      prop: 'a'
    });

    storageCreatePromise.resolve({
      id: 123
    });

    expect(window.location.hash).toEqual('#!/users/123');
  });

  it('should work as edition form', function() {
    var component = jest.genMockFn().mockReturnValue('dom');
    var notEmpty = jest.genMockFn().mockImpl(function(i) { return i.length > 0; });
    var prop = {
      getId: jest.genMockFn().mockReturnValue('prop'),
      getDefaultValue: jest.genMockFn().mockReturnValue(''),
      getComponent: jest.genMockFn().mockReturnValue(component)
    };
    var storageUpdatePromise = $.Deferred();
    var storageReadOnePromise = $.Deferred();
    var storage = {
      update: jest.genMockFn().mockReturnValue(storageUpdatePromise),
      readOne: jest.genMockFn().mockReturnValue(storageReadOnePromise)
    };
    var resource = {
      getStorage: jest.genMockFn().mockReturnValue(storage),
      getFormProperties: jest.genMockFn().mockReturnValue([prop]),
      getValidationConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: notEmpty
        }
      }),
      getErrorMessagesConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: 'prop notEmpty'
        }
      }),
      getViewUrl: jest.genMockFn().mockImpl(function(i) { return '/users/' + i.id; })
    };

    var form = React.addons.TestUtils.renderIntoDocument(Form({
      resource: resource,
      id: 123
    }));

    expect(form.state).toEqual({
      newItem: false,
      loading: true,
      error: false,
      item: {
        prop: ''
      }
    });

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      prop: {
        invalid: true,
        valid: false,
        notEmpty: {
          invalid: true,
          valid: false
        }
      }
    });

    expect(form.getErrorMessages()).toEqual({
      prop: []
    });

    expect(storage.readOne).toBeCalledWith(123);

    storageReadOnePromise.resolve({
      id: 123,
      prop: 'a',
      drop: 'b'
    });

    expect(form.state).toEqual({
      newItem: false,
      loading: false,
      error: false,
      item: {
        prop: 'a'
      }
    });

    expect(form.renderControl(prop)).toEqual('dom');

    var componentProps = component.mock.calls[0][0];
    expect(componentProps.property).toBe(prop);
    expect(componentProps.resource).toBe(resource);
    expect(componentProps.valueLink.value).toEqual('a');
    expect(componentProps.validity).toEqual({
      invalid: false,
      valid: true,
      notEmpty: {
        invalid: false,
        valid: true
      }
    });
    expect(componentProps.setErrorMessageInputBlured).toBeDefined();

    componentProps.valueLink.requestChange('b');

    form.save();

    expect(form.state.loading).toBeTruthy();
    expect(storage.update).toBeCalledWith(123, null, {
      prop: 'b'
    });

    storageUpdatePromise.resolve({
      id: 123,
      prop: 'd',
      drop: 'c'
    });

    expect(form.state).toEqual({
      newItem: false,
      loading: false,
      error: false,
      item: {
        prop: 'd'
      }
    });
  });

  it('should show errors on invalid submit', function() {
    var notEmpty = jest.genMockFn().mockImpl(function(i) { return i.length > 0; });
    var prop = {
      getId: jest.genMockFn().mockReturnValue('prop'),
      getDefaultValue: jest.genMockFn().mockReturnValue('')
    };
    var resource = {
      getFormProperties: jest.genMockFn().mockReturnValue([prop]),
      getValidationConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: notEmpty
        }
      }),
      getErrorMessagesConfiguration: jest.genMockFn().mockReturnValue({
        prop: {
          notEmpty: 'prop notEmpty'
        }
      })
    };

    var form = React.addons.TestUtils.renderIntoDocument(Form({
      resource: resource
    }));

    expect(form.getErrorMessages()).toEqual({
      prop: []
    });

    form.save();

    expect(form.getErrorMessages()).toEqual({
      prop: ['prop notEmpty']
    });
  });
});
