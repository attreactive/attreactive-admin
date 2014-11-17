/**
 * AttrEactive Admin
 */

var cls = require("cls");
var Router = require("attreactive-router/lib/Router");
var Menu = require("attreactive-menu/lib/Menu");

var AdminSetup = cls.extend({
  init: function(authManager, router) {
    this._authManager = authManager;
    this._router = router || new Router();
    this._menu = new Menu();
  },

  getAuthorizationManager: function() {
    return this._authManager;
  },

  getRouter: function() {
    return this._router;
  },

  getMenu: function() {
    return this._menu;
  },

  addPage: function(url, title, component, meta) {
    this._router.add(url, component);
    this._menu.addItem(url, title, meta);
  }
});

module.exports = AdminSetup;
