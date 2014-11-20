/**
 * AttrEactive Admin
 */

var cls = require("cls");
var Router = require("attreactive-router/lib/Router");

var AdminSetup = cls.extend({
  init: function(authManager, router) {
    this._authManager = authManager;
    this._router = router || new Router();
  },

  getAuthorizationManager: function() {
    return this._authManager;
  },

  getRouter: function() {
    return this._router;
  }
});

module.exports = AdminSetup;
