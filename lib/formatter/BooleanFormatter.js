/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");

var StringFormatter = Formatter.extend({
  format: function(value) {
    if (typeof value !== 'boolean') return 'Invalid string';

    return value ? 'Да' : 'Нет';
  }
});

module.exports = StringFormatter;
