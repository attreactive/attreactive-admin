/**
 * AttrEactive Admin
 */

var cls = require("cls");
var RestStorage = require("../storage/RestStorage");
var PropertyStringifier = require("../stringifier/PropertyStringifier");
var AdminResource = require("./AdminResource");
var AdminResourceProperty = require("./AdminResourceProperty");
var AdminResourceAction = require("./AdminResourceAction");
var Menu = require("attreactive-menu/lib/Menu");
var i18n = require("attreactive-i18n");
var Formatter = require("../formatter/Formatter");

i18n.extend('en', {
  'attreactive/admin/resource-factory/create-new': 'Create new'
});

i18n.extend('ru', {
  'attreactive/admin/resource-factory/create-new': 'Создать'
});

var AdminResourceFactory = cls.extend({
  init: function(adminSetup, formComponentMatcher, formatterFactory) {
    this._router = adminSetup.getRouter();
    this._menu = adminSetup.getMenu();
    this._authManager = adminSetup.getAuthorizationManager();
    this._formComponentMatcher = formComponentMatcher;
    this._formatterFactory = formatterFactory;
    this._listingComponent = null;
    this._viewComponent = null;
    this._formComponent = null;
    this._resources = {};
  },

  setDefaultListingComponent: function(listingComponent) {
    this._listingComponent = listingComponent;
  },

  setDefaultViewComponent: function(viewComponent) {
    this._viewComponent = viewComponent;
  },

  setDefaultFormComponent: function(formComponent) {
    this._formComponent = formComponent;
  },

  factory: function(id, resourceSchema) {
    var resource = this._factoryResource(id, resourceSchema);

    this._resources[id] = resource;

    var listingComponent = this._listingComponent;
    var viewComponent = this._viewComponent;
    var formComponent = this._formComponent;

    if (resourceSchema.listingComponent) {
      listingComponent = resourceSchema.listingComponent;
    }

    if (resourceSchema.viewComponent) {
      viewComponent = resourceSchema.viewComponent;
    }

    if (resourceSchema.formComponent) {
      formComponent = resourceSchema.formComponent;
    }

    var listingUrl = resource.getListingUrl();
    var createUrl = listingUrl + 'new';
    var viewUrl = listingUrl + ':?';
    var editUrl = listingUrl + ':?/edit';
    var childMenu = null;

    if (resourceSchema.formComponent || resource.getCreateFormProperties().length > 0) {
      this._router.add(createUrl, function() {
        return formComponent({resource: resource});
      });
    }

    if (resourceSchema.formComponent || resource.getEditFormProperties().length > 0) {
      this._router.add(editUrl, function(id) {
        return formComponent({resource: resource, id: id});
      });

      childMenu = new Menu();
      childMenu.addItem(createUrl, i18n('attreactive/admin/resource-factory/create-new'), resource.getMetadata());
    }

    if (resourceSchema.listingComponent || resource.getListingProperties().length > 0) {
      this._router.add(listingUrl, function() {
        return listingComponent({resource: resource});
      });

      this._menu.addItem(listingUrl, resource.getTitle(), resource.getMetadata(), childMenu);
    }

    if (resourceSchema.viewComponent || resource.getViewProperties().length > 0) {
      this._router.add(viewUrl, function(id) {
        return viewComponent({resource: resource, id: id});
      });
    }
  },

  _factoryResource: function(id, resourceSchema) {
    var title, storage, stringifier, resource;

    if (resourceSchema.title) {
      title = resourceSchema.title;
    } else {
      title = id[0].toUpperCase() + id.slice(1);
    }

    if (resourceSchema.rest) {
      var baseUrl, defaultQuery, defaultData;

      if (typeof resourceSchema.rest === 'string') {
        baseUrl = resourceSchema.rest;
      } else {
        baseUrl = resourceSchema.rest.baseUrl;
        defaultQuery = resourceSchema.rest.defaultQuery;
        defaultData = resourceSchema.rest.defaultData;
      }

      storage = new RestStorage(baseUrl, defaultQuery, defaultData, this._authManager);
    }

    if (resourceSchema.stringify) {
      stringifier = new PropertyStringifier(resourceSchema.stringify);
    }

    resource = new AdminResource(id, title, storage, stringifier);

    if (resourceSchema.meta) {
      resource.setMetadata(resourceSchema.meta);
    }

    if (resourceSchema.idProperty) {
      resource.setIdProperty(resourceSchema.idProperty);
    }

    if (resourceSchema.defaultSortingProperty) {
      resource.setDefaultSortingProperty(resourceSchema.defaultSortingProperty);
    }

    if (resourceSchema.defaultSortingDirection) {
      resource.setDefaultSortingDirection(resourceSchema.defaultSortingDirection);
    }

    if (resourceSchema.properties) {
      Object.keys(resourceSchema.properties).forEach(function(key) {
        var property = this._factoryProperty(key, resourceSchema.properties[key]);
        resource.addProperty(property);
      }, this);
    }

    if (resourceSchema.actions) {
      resourceSchema.actions.forEach(function(action) {
        resource.addAction(new AdminResourceAction(
          action.title,
          action.meta,
          action.condition,
          action.action
        ));
      }, this);
    }

    return resource;
  },

  _factoryProperty: function(key, propertySchema) {
    var title, formatter, validationConstraints, errorMessages, component, property;

    if (!propertySchema || typeof propertySchema !== 'object') {
      propertySchema = {};
    }

    if (propertySchema.title) {
      title = propertySchema.title;
    } else {
      title = key[0].toUpperCase() + key.slice(1);
    }

    if (!propertySchema.format) {
      formatter = this._formatterFactory.get('string');
    } else if (typeof propertySchema.format === 'string') {
      formatter = this._formatterFactory.get(propertySchema.format);
    } else {
      formatter = Formatter.extend(propertySchema.format);
      formatter = new formatter();
    }

    if (propertySchema.constraints) {
      validationConstraints = propertySchema.constraints;
    } else {
      validationConstraints = null;
    }

    if (propertySchema.errorMessages) {
      errorMessages = propertySchema.errorMessages;
    } else {
      errorMessages = null;
    }

    component = this._formComponentMatcher.match(propertySchema.component || 'input');

    property = new AdminResourceProperty(
      key,
      title,
      formatter,
      validationConstraints,
      errorMessages,
      component
    );

    if ('defaultValue' in propertySchema) {
      property.setDefaultValue(propertySchema.defaultValue);
    }

    if ('visibleInListing' in propertySchema) {
      property.setVisibleInListing(!!propertySchema.visibleInListing);
    }

    if ('visibleInView' in propertySchema) {
      property.setVisibleInView(!!propertySchema.visibleInView);
    }

    if ('visibleInForm' in propertySchema) {
      property.setVisibleInCreateForm(!!propertySchema.visibleInForm);
      property.setVisibleInEditForm(!!propertySchema.visibleInForm);
    }

    if ('visibleInCreateForm' in propertySchema) {
      property.setVisibleInCreateForm(!!propertySchema.visibleInCreateForm);
    }

    if ('visibleInEditForm' in propertySchema) {
      property.setVisibleInEditForm(!!propertySchema.visibleInEditForm);
    }

    if ('linkable' in propertySchema) {
      property.setLinkable(!!propertySchema.linkable);
    }

    if ('dependency' in propertySchema) {
      property.setDependency(this._resources[propertySchema.dependency]);
    }

    if ('meta' in propertySchema) {
      property.setMetadata(propertySchema.meta);
    }

    return property;
  }
});

module.exports = AdminResourceFactory;
