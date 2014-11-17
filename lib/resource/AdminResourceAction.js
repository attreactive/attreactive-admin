/**
 * AttrEactive Admin
 */

var cls = require("cls");

var AdminResourceAction = cls.extend({
  init: function(title, meta, condition, action) {
    this._title = title;
    this._metadata = meta;
    this._condition = condition;
    this._action = action;
  },

  getTitle: function() {
    return this._title;
  },

  getMetadata: function() {
    return this._metadata;
  },

  getCondition: function() {
    return this._condition;
  },

  isVisible: function (item) {
    return this._condition(item);
  },

  getAction: function() {
    return this._action;
  }
});

module.exports = AdminResourceAction;
