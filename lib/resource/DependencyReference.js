/**
 * AttrEactive Admin
 */

var cls = require("cls");


var DependencyReference = cls.extend({
  init: function(resources, name) {
    this._resources = resources;
    this._name = name;
  },

  getResource: function() {
    return this._resources[this._name];
  }
});

module.exports = DependencyReference;
