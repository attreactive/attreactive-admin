/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");
var moment = require("moment");

var DateFormatter = Formatter.extend({
  format: function(value) {
    if (typeof value !== 'string') return 'Invalid date';

    return moment(value).format('DD.MM.YYYY HH:mm:ss');
  },

  compare: function (a, b) {
    a = moment(a);
    b = moment(b);

    if (a.isSame(b)) {
      return 0;
    }

    return a.isBefore(b) ? -1 : 1;
  }
});

module.exports = DateFormatter;
