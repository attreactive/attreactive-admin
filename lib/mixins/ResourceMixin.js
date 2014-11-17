/**
 * AttrEactive Admin
 */

var ResourceMixin = {
  getResource: function() {
    return this.props.resource;
  },

  getTitle: function() {
    return this.getResource().getTitle();
  },

  getListingUrl: function() {
    return this.getResource().getListingUrl();
  },

  getViewUrl: function(item) {
    return this.getResource().getViewUrl(item);
  },

  getListingProperties: function() {
    return this.getResource().getListingProperties();
  },

  getViewProperties: function() {
    return this.getResource().getViewProperties();
  },

  getCreateFormProperties: function() {
    return this.getResource().getCreateFormProperties();
  },

  getEditFormProperties: function() {
    return this.getResource().getEditFormProperties();
  },

  getMetadata: function() {
    return this.getResource().getMetadata();
  }
};

module.exports = ResourceMixin;
