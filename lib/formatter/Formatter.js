/**
 * AttrEactive Admin
 */

var cls = require("cls");

var Formatter = cls.extend({
  compare: function (a, b, dependencyResource, dependencies) {
    a = this.format(a, dependencyResource, dependencies);
    b = this.format(b, dependencyResource, dependencies);

    if (a === b) {
      return 0;
    }

    if (typeof a != typeof b) {
      return typeof a < typeof b ? -1 : 1;
    } else {
      return a < b ? -1 : 1;
    }
  }
});

module.exports = Formatter;
