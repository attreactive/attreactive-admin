/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");

var StringFormatter = Formatter.extend({
  format: function(value) {
    if (typeof value !== 'string') return 'Invalid string';

    return value;
  }
});

module.exports = StringFormatter;
