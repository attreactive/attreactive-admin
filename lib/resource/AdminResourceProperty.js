/**
 * AttrEactive Admin
 */

var cls = require("cls");

var AdminResourceProperty = cls.extend({
  init: function(id, title, formatter, validationConstraints, errorMessages, component) {
    this._id = id;
    this._title = title;
    this._formatter = formatter;
    this._validationConstraints = validationConstraints;
    this._errorMessages = errorMessages;
    this._component = component;
    this._defaultValue = null;
    this._visibleInListing = true;
    this._visibleInView = true;
    this._visibleInCreateForm = true;
    this._visibleInEditForm = true;
    this._linkable = false;
    this._dependency = null;
    this._metadata = {};
  },

  getId: function() {
    return this._id;
  },

  getTitle: function() {
    return this._title;
  },

  getFormatter: function() {
    return this._formatter;
  },

  getValidationConstraints: function() {
    return this._validationConstraints;
  },

  getErrorMessages: function() {
    return this._errorMessages;
  },

  getComponent: function() {
    return this._component;
  },

  setDefaultValue: function(defaultValue) {
    this._defaultValue = defaultValue;
  },

  getDefaultValue: function() {
    return this._defaultValue;
  },

  setVisibleInListing: function(visibleInListing) {
    this._visibleInListing = visibleInListing;
  },

  isVisibleInListing: function() {
    return this._visibleInListing;
  },

  setVisibleInView: function(visibleInView) {
    this._visibleInView = visibleInView;
  },

  isVisibleInView: function() {
    return this._visibleInView;
  },

  setVisibleInCreateForm: function(visibleInCreateForm) {
    this._visibleInCreateForm = visibleInCreateForm;
  },

  isVisibleInCreateForm: function() {
    return this._visibleInCreateForm;
  },

  setVisibleInEditForm: function(visibleInEditForm) {
    this._visibleInEditForm = visibleInEditForm;
  },

  isVisibleInEditForm: function() {
    return this._visibleInEditForm;
  },

  setLinkable: function(linkable) {
    this._linkable = linkable;
  },

  isLinkable: function() {
    return this._linkable;
  },

  setDependency: function(resource) {
    this._dependency = resource;
  },

  getDependency: function() {
    return this._dependency;
  },

  setMetadata: function(metadata) {
    this._metadata = metadata;
  },

  getMetadata: function() {
    return this._metadata;
  }
});

module.exports = AdminResourceProperty;
