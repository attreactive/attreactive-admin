/**
 * AttrEactive Admin
 */
var ResourceMixin = require("./ResourceMixin");

var ResourceViewMixin = {
  mixins: [ResourceMixin],

  getInitialState: function() {
    return {
      loading: true,
      error: false,
      item: null,
      dependencies: {}
    };
  },

  componentDidMount: function() {
    this.reloadData();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps !== this.props) {
      this.setState(this.getInitialState());
      this.reloadData(nextProps);
    }
  },

  reloadData: function(props) {
    props = props || this.props;

    var errorHandler = function() {
      this.setState({
        loading: false,
        error: true
      });
    }.bind(this);

    props.resource.getStorage().readOne(props.id)
      .then(function(item) {
        var unresolvedDependencies = [];
        var dependencies = {};

        props.resource.getViewProperties().forEach(function(property) {
          var dependency = property.getDependency();

          if (dependency) {
            var propertyDependencies = item[property.getId()];
            var type = Object.prototype.toString.call(propertyDependencies);

            switch (type) {
              case "[object Array]":
                  if (typeof propertyDependencies[0] === 'object') {
                    dependencies[dependency.getId()] = propertyDependencies;
                    item[property.getId()] = propertyDependencies.map(function(objects) {
                      return objects[dependency.getIdProperty()];
                    });
                  } else {
                    unresolvedDependencies.push(dependency);
                  }
                break;
              case "[object Number]":
                unresolvedDependencies.push(dependency);
                break;
              case "[object Object]":
                dependencies[dependency.getId()] = propertyDependencies;
                item[property.getId()] = propertyDependencies[dependency.getIdProperty()];
                break;
              default:
                break;
            }
          }
        });

        this.setState({
          dependencies: dependencies,
          loading: unresolvedDependencies.length > 0,
          item: item
        });

        return unresolvedDependencies;
      }.bind(this))
      .then(function(unresolvedDependencies) {
        var waiting = unresolvedDependencies.length;

        var dependencyHandlerFactory = function(dependency) {
          return function(items) {
            waiting -= 1;

            this.state.dependencies[dependency.getId()] = items;

            if (waiting === 0) {
              this.setState({
                loading: false
              });
            }
          }.bind(this);
        }.bind(this);

        unresolvedDependencies.forEach(function(dependency) {
          dependency.getStorage().readAll()
            .then(dependencyHandlerFactory(dependency), errorHandler);
        });
      }.bind(this))
      .then(null, errorHandler);
  },

  readFormattedValue: function(property) {
    var formatter = property.getFormatter();
    var dependency = property.getDependency();
    var dependencies;

    if (dependency) {
      dependencies = this.state.dependencies[dependency.getId()];
    }

    return formatter.format(this.state.item[property.getId()], dependency, dependencies);
  },

  getItemTitle: function() {
    if (this.state.item) {
      return this.getResource().stringify(this.state.item);
    } else {
      return '—';
    }
  },

  deleteItem: function() {
    this.setState({loading: true}, function() {
      this.props.resource.getStorage().delete(this.props.id)
        .then(function(item) {
          window.location.href = '#!' + this.props.resource.getListingUrl();
        }.bind(this))
        .then(null, function() {
          this.setState({
            loading: false,
            error: true
          });
        }.bind(this));
    }.bind(this));
  }
};

module.exports = ResourceViewMixin;