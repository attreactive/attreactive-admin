/**
 * AttrEactive Admin
 */

var ResourceMixin = require("./ResourceMixin");

var ResourceListingMixin = {
  mixins: [ResourceMixin],

  getInitialState: function() {
    return {
      loading: true,
      error: false,
      page: 1,
      limit: 25,
      filter: '',
      sortingProperty: null,
      sortingDirection: 'asc',
      items: [],
      dependencies: {}
    };
  },

  componentDidMount: function() {
    this.reloadData();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.resource !== this.props.resource) {
      this.setState(this.getInitialState());
      this.reloadData(nextProps);
    }
  },

  reloadData: function(props) {
    props = props || this.props;

    var dependencies = props.resource.getListingDependencies();

    var waiting = dependencies.length + 1;
    var hasError = false;

    var errorHandler = function() {
      hasError = true;

      this.setState({
        loading: false,
        error: true
      });
    }.bind(this);

    var itemsHandler = function(items) {
      waiting -= 1;

      this.setState({
        loading: waiting > 0,
        items: items
      });
    }.bind(this);

    var dependencyHandlerFactory = function(dependency) {
      return function(items) {
        waiting -= 1;

        this.state.dependencies[dependency.getId()] = items;

        this.setState({
          loading: waiting > 0
        });
      }.bind(this);
    }.bind(this);

    props.resource.getStorage().readAll()
      .then(itemsHandler, errorHandler);

    dependencies.forEach(function(dependency) {
      dependency.getStorage().readAll()
        .then(dependencyHandlerFactory(dependency), errorHandler);
    });
  },

  readFormattedValue: function(property, item) {
    var formatter = property.getFormatter();
    var dependency = property.getDependency();
    var dependencies;

    if (dependency) {
      dependencies = this.state.dependencies[dependency.getId()];
    }

    return formatter.format(item[property.getId()], dependency, dependencies);
  },

  getFilteredItems: function() {
    var items = this.state.items;
    var filter = this.state.filter.toLowerCase();
    var properties = this.props.resource.getProperties();

    if (filter.length > 0) {
      items = items.filter(function(item) {
        return properties.some(function(prop) {
          var value;
          if (prop.isVisibleInListing()) {
            value = this.readFormattedValue(prop, item);
            return String(value).toLowerCase().indexOf(filter) >= 0;
          }

          return false;
        }, this);
      }, this);
    }

    return items;
  },

  getFirstItemNumber: function() {
    var number =  (this.state.page - 1) * this.state.limit + 1;

    if (number > this.state.items.length) {
      number = this.state.items.length;
    }

    return number;
  },

  getLastItemNumber: function() {
    var number = this.state.page * this.state.limit;

    if (number > this.state.items.length) {
      number = this.state.items.length;
    }

    return number;
  },

  getItemsLength: function() {
    return this.state.items.length;
  }
};

module.exports = ResourceListingMixin;
