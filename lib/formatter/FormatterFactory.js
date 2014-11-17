/**
 * AttrEactive Admin
 */

var cls = require("cls");

var FormatterFactory = cls.extend({
  init: function() {
    this._formatters = {};
  },

  factory: function(type, Formatter) {
    this._formatters[type] = new Formatter();
  },

  get: function(type) {
    return this._formatters[type] || null;
  }
});

module.exports = FormatterFactory;
