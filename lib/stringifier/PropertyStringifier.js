/**
 * AttrEactive Admin
 */

var cls = require("cls");

var PropertyStringifier = cls.extend({
  init: function(property) {
    this._property = property;
  },

  stringify: function(item) {
    if (!item || typeof item !== 'object' || typeof item[this._property] !== 'string') {
      throw new Error('Invalid property value');
    }

    return item[this._property];
  }
});

module.exports = PropertyStringifier;
