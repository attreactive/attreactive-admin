/**
 * AttrEactive Admin
 */

var cls = require("cls");
var $ = require("jquery");

var RestStorage = cls.extend({
  init: function(baseUrl, defaultQuery, defaultData, authManager) {
    this._baseUrl = baseUrl;
    this._authManager = authManager;
    // this._authData = authManager.getAuthorizationData() || {};
    this._defaultQuery = defaultQuery;
    this._defaultData = defaultData;
  },

  readAll: function(query) {
    return $.ajax({
      url: this._getUrl(null, query),
      type: 'GET',
      dataType: 'json'
    });
  },

  readOne: function(id, query) {
    return $.ajax({
      url: this._getUrl(id, query),
      type: 'GET',
      dataType: 'json'
    });
  },

  create: function(query, data) {
    return $.ajax({
      url: this._getUrl(null, query),
      type: 'POST',
      dataType: 'json',
      data: this._getData(data)
    });
  },

  update: function(id, query, data) {
    query = query || {};
    query['_method'] = 'PUT';

    return $.ajax({
      url: this._getUrl(id, query),
      type: 'POST',
      dataType: 'json',
      data: this._getData(data)
    });
  },

  patch: function(id, query, data) {
    query = query || {};
    query['_method'] = 'PATCH';

    return $.ajax({
      url: this._getUrl(id, query),
      type: 'POST',
      dataType: 'json',
      data: this._getData(data)
    });
  },

  delete: function(id, query, data) {
    query = query || {};
    query['_method'] = 'DELETE';

    return $.ajax({
      url: this._getUrl(id, query),
      type: 'POST',
      dataType: 'json',
      data: this._getData(data)
    });
  },

  _getUrl: function(id, query) {
    var url = this._baseUrl;

    if (id) {
      if (this._baseUrl[this._baseUrl.length - 1] != '/') {
        url += '/';
      }

      url += id;
    }

    var authData = this._authManager.getAuthorizationData();

    if (this._defaultQuery || query || authData) {
      url += '?';
      url += $.param($.extend({}, this._defaultQuery || {}, query || {}, authData || {}));
    }

    return url;
  },

  _getData: function(data) {
    if (this._defaultData || data) {
      return $.extend({}, this._defaultData || {}, data || {});
    }

    return null;
  }
});

module.exports = RestStorage;
