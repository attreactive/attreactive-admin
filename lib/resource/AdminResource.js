/**
 * AttrEactive Admin
 */

var cls = require("cls");

var AdminResource = cls.extend({
  init: function(id, title, storage, stringifier) {
    this._id = id;
    this._title = title;
    this._storage = storage;
    this._stringifier = stringifier;
    this._defaultSortingProperty = null;
    this._defaultSortingDirection = 'asc';
    this._metadata = {};
    this._idProperty = 'id';
    this._properties = [];
    this._actions = [];
  },

  getId: function() {
    return this._id;
  },

  getTitle: function() {
    return this._title;
  },

  getStorage: function() {
    return this._storage;
  },

  getStringifier: function() {
    return this._stringifier;
  },

  setMetadata: function(metadata) {
    this._metadata = metadata;
  },

  getMetadata: function() {
    return this._metadata;
  },

  setIdProperty: function(idProperty) {
    this._idProperty = idProperty;
  },

  getIdProperty: function() {
    return this._idProperty;
  },

  addProperty: function(property) {
    this._properties.push(property);
  },

  addAction: function(action) {
    this._actions.push(action);
  },

  getProperties: function() {
    return this._properties;
  },

  getActions: function () {
    return this._actions;
  },

  getListingProperties: function() {
    return this._properties.filter(function(property) {
      return property.isVisibleInListing();
    });
  },

  getViewProperties: function() {
    return this._properties.filter(function(property) {
      return property.isVisibleInView();
    });
  },

  getCreateFormProperties: function() {
    return this._properties.filter(function(property) {
      return property.isVisibleInCreateForm();
    });
  },

  getEditFormProperties: function() {
    return this._properties.filter(function(property) {
      return property.isVisibleInEditForm();
    });
  },

  getCreateValidationConfiguration: function() {
    return this.getCreateFormProperties().reduce(function(validationConfiguration, property) {
      var validationConstraints = property.getValidationConstraints()

      if (validationConstraints) {
        validationConfiguration[property.getId()] = validationConstraints;
      }

      return validationConfiguration;
    }, {});
  },

  getEditValidationConfiguration: function() {
    return this.getEditFormProperties().reduce(function(validationConfiguration, property) {
      var validationConstraints = property.getValidationConstraints()

      if (validationConstraints) {
        validationConfiguration[property.getId()] = validationConstraints;
      }

      return validationConfiguration;
    }, {});
  },

  getCreateErrorMessagesConfiguration: function() {
    return this.getCreateFormProperties().reduce(function(errorMessagesConfig, property) {
      var errorMessages = property.getErrorMessages()

      if (errorMessages) {
        errorMessagesConfig[property.getId()] = errorMessages;
      }

      return errorMessagesConfig;
    }, {});
  },

  getEditErrorMessagesConfiguration: function() {
    return this.getEditFormProperties().reduce(function(errorMessagesConfig, property) {
      var errorMessages = property.getErrorMessages()

      if (errorMessages) {
        errorMessagesConfig[property.getId()] = errorMessages;
      }

      return errorMessagesConfig;
    }, {});
  },

  getDependencies: function() {
    return this._getDependencies(this.getProperties());
  },

  getListingDependencies: function() {
    return this._getDependencies(this.getListingProperties());
  },

  getViewDependencies: function() {
    return this._getDependencies(this.getViewProperties());
  },

  getCreateFormDependencies: function() {
    return this._getDependencies(this.getCreateFormProperties());
  },

  getEditFormDependencies: function() {
    return this._getDependencies(this.getEditFormProperties());
  },

  _getDependencies: function(properties) {
    return properties.reduce(function(dependencies, property) {
      var dependency = property.getDependency();

      if (dependency && dependencies.indexOf(dependency) < 0) {
        dependencies.push(dependency);
      }

      return dependencies;
    }, []);
  },

  setDefaultSortingProperty: function(defaultSortingProperty) {
    this._defaultSortingProperty = defaultSortingProperty;
  },

  getDefaultSortingProperty: function() {
    return this._defaultSortingProperty;
  },

  setDefaultSortingDirection: function(defaultSortingDirection) {
    this._defaultSortingDirection = defaultSortingDirection;
  },

  getDefaultSortingDirection: function() {
    return this._defaultSortingDirection;
  },

  getListingUrl: function() {
    return '/' + this._id + '/';
  },

  getViewUrl: function(item) {
    return this.getListingUrl() + item[this._idProperty];
  },

  stringify: function(item) {
    return this._stringifier.stringify(item);
  }
});

module.exports = AdminResource;
