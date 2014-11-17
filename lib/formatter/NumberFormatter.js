/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");

var NumberFormatter = Formatter.extend({
  format: function(value) {
    if (typeof value !== 'number') return 'Invalid number';

    return String(value);
  }
});

module.exports = NumberFormatter;
