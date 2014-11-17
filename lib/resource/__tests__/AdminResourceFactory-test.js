/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var AdminResourceFactory = require("../AdminResourceFactory");
var RestStorage = require("../../storage/RestStorage");
var PropertyStringifier = require("../../stringifier/PropertyStringifier");
var StringFormatter = require("../../formatter/StringFormatter");
var DateFormatter = require("../../formatter/DateFormatter");

describe('AdminResourceFactory', function() {
  it('should work with short schema', function() {
    var router = {add: jest.genMockFn()};
    var menu = {addItem: jest.genMockFn()};
    var adminSetup = {
      getRouter: function() { return router; },
      getMenu: function() { return menu; }
    };
    var input = jest.genMockFn();
    var formComponentMatcher = {
      match: jest.genMockFn().mockReturnValue(input)
    };
    var listingComponent = jest.genMockFn();
    var viewComponent = jest.genMockFn();
    var formComponent = jest.genMockFn();

    var factory = new AdminResourceFactory(adminSetup, formComponentMatcher);
    factory.setDefaultListingComponent(listingComponent);
    factory.setDefaultViewComponent(viewComponent);
    factory.setDefaultFormComponent(formComponent);

    factory.factory('users', {
      rest: '/api/users/',
      stringify: 'name',
      properties: {
        name: null
      }
    });

    expect(menu.addItem).toBeCalled();
    expect(menu.addItem.mock.calls[0][0]).toEqual('/users/');
    expect(menu.addItem.mock.calls[0][1]).toEqual('Users');
    expect(menu.addItem.mock.calls[0][2]).toEqual({});
    expect(menu.addItem.mock.calls[0][3]._items).toEqual([
      {url: '/users/new', title: 'Create new', meta: {}}
    ]);
    expect(router.add.mock.calls.length).toEqual(4);
    expect(router.add.mock.calls[0][0]).toEqual('/users/new');
    expect(router.add.mock.calls[1][0]).toEqual('/users/:?/edit');
    expect(router.add.mock.calls[2][0]).toEqual('/users/');
    expect(router.add.mock.calls[3][0]).toEqual('/users/:?');

    router.add.mock.calls[0][1]();

    expect(formComponent).toBeCalled();
    expect(formComponent.mock.calls[0][0].resource).toBeDefined();

    formComponent.mockClear();
    router.add.mock.calls[1][1](123);

    expect(formComponent).toBeCalled();
    expect(formComponent.mock.calls[0][0].resource).toBeDefined();
    expect(formComponent.mock.calls[0][0].id).toBeDefined();
    expect(formComponent.mock.calls[0][0].id).toEqual(123);

    router.add.mock.calls[2][1]();

    expect(listingComponent).toBeCalled();
    expect(listingComponent.mock.calls[0][0].resource).toBeDefined();

    router.add.mock.calls[3][1](123);

    expect(viewComponent).toBeCalled();
    expect(viewComponent.mock.calls[0][0].resource).toBeDefined();
    expect(viewComponent.mock.calls[0][0].id).toBeDefined();
    expect(viewComponent.mock.calls[0][0].id).toEqual(123);

    var resource = listingComponent.mock.calls[0][0].resource;

    expect(resource.getId()).toEqual('users');
    expect(resource.getTitle()).toEqual('Users');
    expect(resource._storage instanceof RestStorage).toBeTruthy();
    expect(resource._storage._baseUrl).toEqual('/api/users/');
    expect(resource._stringifier instanceof PropertyStringifier).toBeTruthy();
    expect(resource._stringifier._property).toEqual('name');
    expect(resource.getMetadata()).toEqual({});
    expect(resource.getIdProperty()).toEqual('id');
    expect(resource.getProperties().length).toEqual(1);

    var prop = resource.getProperties()[0];

    expect(prop.getId()).toEqual('name');
    expect(prop.getTitle()).toEqual('Name');
    expect(prop.getFormatter() instanceof StringFormatter).toBeTruthy();
    expect(prop.getValidationConstraints()).toBeNull();
    expect(prop.getErrorMessages()).toBeNull();
    expect(prop.getComponent()).toBe(input);
    expect(prop.getDefaultValue()).toBeNull();
    expect(prop.isVisibleInListing()).toBeTruthy();
    expect(prop.isVisibleInView()).toBeTruthy();
    expect(prop.isVisibleInForm()).toBeTruthy();
    expect(prop.isLinkable()).toBeFalsy();
  });

  it.only('should work with full custom schema', function() {
    var router = {add: jest.genMockFn()};
    var menu = {addItem: jest.genMockFn()};
    var adminSetup = {
      getRouter: function() { return router; },
      getMenu: function() { return menu; }
    };
    var input = jest.genMockFn();
    var formComponentMatcher = {
      match: jest.genMockFn().mockReturnValue(input)
    };
    var listingComponent = jest.genMockFn();
    var viewComponent = jest.genMockFn();
    var formComponent = jest.genMockFn();
    var customListingComponent = jest.genMockFn();
    var customViewComponent = jest.genMockFn();
    var customFormComponent = jest.genMockFn();
    var notNull = jest.genMockFn();

    var factory = new AdminResourceFactory(adminSetup, formComponentMatcher);
    factory.setDefaultListingComponent(listingComponent);
    factory.setDefaultViewComponent(viewComponent);
    factory.setDefaultFormComponent(formComponent);

    factory.factory('users', {
      title: 'userS',
      rest: '/api/users/',
      stringify: 'name',
      meta: {a: 1},
      idProperty: '_id',
      properties: {
        name: {
          title: 'namE',
          format: 'date',
          constraints: {
            notNull: notNull
          },
          errorMessages: {
            notNull: 'name notNull'
          },
          component: 'calendar',
          defaultValue: '11.11.1111',
          visibleInListing: false,
          visibleInView: false,
          visibleInForm: false,
          linkable: true
        }
      },
      listingComponent: customListingComponent,
      viewComponent: customViewComponent,
      formComponent: customFormComponent
    });

    expect(formComponentMatcher.match).toBeCalledWith('calendar');

    expect(menu.addItem).toBeCalled();
    expect(menu.addItem.mock.calls[0][0]).toEqual('/users/');
    expect(menu.addItem.mock.calls[0][1]).toEqual('userS');
    expect(menu.addItem.mock.calls[0][2]).toEqual({a: 1});
    expect(menu.addItem.mock.calls[0][3]._items).toEqual([
      {url: '/users/new', title: 'Create new', meta: {a: 1}}
    ]);

    expect(router.add.mock.calls.length).toEqual(4);
    expect(router.add.mock.calls[0][0]).toEqual('/users/new');
    expect(router.add.mock.calls[1][0]).toEqual('/users/:?/edit');
    expect(router.add.mock.calls[2][0]).toEqual('/users/');
    expect(router.add.mock.calls[3][0]).toEqual('/users/:?');

    router.add.mock.calls[0][1]();

    expect(formComponent).not.toBeCalled();
    expect(customFormComponent).toBeCalled();
    expect(customFormComponent.mock.calls[0][0].resource).toBeDefined();

    customFormComponent.mockClear();
    router.add.mock.calls[1][1](123);

    expect(formComponent).not.toBeCalled();
    expect(customFormComponent).toBeCalled();
    expect(customFormComponent.mock.calls[0][0].resource).toBeDefined();
    expect(customFormComponent.mock.calls[0][0].id).toBeDefined();
    expect(customFormComponent.mock.calls[0][0].id).toEqual(123);

    router.add.mock.calls[2][1]();

    expect(listingComponent).not.toBeCalled();
    expect(customListingComponent).toBeCalled();
    expect(customListingComponent.mock.calls[0][0].resource).toBeDefined();

    router.add.mock.calls[3][1](123);

    expect(viewComponent).not.toBeCalled();
    expect(customViewComponent).toBeCalled();
    expect(customViewComponent.mock.calls[0][0].resource).toBeDefined();
    expect(customViewComponent.mock.calls[0][0].id).toBeDefined();
    expect(customViewComponent.mock.calls[0][0].id).toEqual(123);

    var resource = customListingComponent.mock.calls[0][0].resource;

    expect(resource.getId()).toEqual('users');
    expect(resource.getTitle()).toEqual('userS');
    expect(resource._storage instanceof RestStorage).toBeTruthy();
    expect(resource._storage._baseUrl).toEqual('/api/users/');
    expect(resource._stringifier instanceof PropertyStringifier).toBeTruthy();
    expect(resource._stringifier._property).toEqual('name');
    expect(resource.getMetadata()).toEqual({a: 1});
    expect(resource.getIdProperty()).toEqual('_id');
    expect(resource.getProperties().length).toEqual(1);

    var prop = resource.getProperties()[0];

    expect(prop.getId()).toEqual('name');
    expect(prop.getTitle()).toEqual('namE');
    expect(prop.getFormatter() instanceof DateFormatter).toBeTruthy();
    expect(prop.getValidationConstraints()).toEqual({notNull: notNull});
    expect(prop.getErrorMessages()).toEqual({notNull: 'name notNull'});
    expect(prop.getComponent()).toBe(input);
    expect(prop.getDefaultValue()).toEqual('11.11.1111');
    expect(prop.isVisibleInListing()).toBeFalsy();
    expect(prop.isVisibleInView()).toBeFalsy();
    expect(prop.isVisibleInForm()).toBeFalsy();
    expect(prop.isLinkable()).toBeTruthy();
  });
});
