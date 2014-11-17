/**
 * AttrEactive Admin
 */

var cls = require("cls");

var FormComponentMatcher = cls.extend({
  init: function() {
    this._components = {};
  },

  registerComponent: function(type, component) {
    this._components[type] = component;
  },

  match: function(type) {
    return this._components[type] || null;
  }
});

module.exports = FormComponentMatcher;
