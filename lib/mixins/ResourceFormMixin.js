/**
 * AttrEactive Admin
 */

var ResourceMixin = require("./ResourceMixin");
var validator = require("attreactive-validator/lib/validator");
var ErrorMessagesMixin = require('attreactive-mixins/lib/form/ErrorMessagesMixin');

var ResourceFormMixin = {
  mixins: [ResourceMixin, ErrorMessagesMixin],

  getInitialState: function(props) {
    props = props || this.props;

    var newItem = !props.id;

    var properties = newItem ?
      props.resource.getCreateFormProperties() :
      props.resource.getEditFormProperties();

    var dependencies = newItem ?
      props.resource.getCreateFormDependencies() :
      props.resource.getEditFormDependencies();

    var item = properties.reduce(function(item, property) {
      item[property.getId()] = property.getDefaultValue();
      return item;
    }, {});

    return {
      newItem: newItem,
      loading: !newItem || dependencies.length > 0,
      error: false,
      item: item,
      dependencies: {}
    };
  },

  getValidationStateRoot: function(state) {
    return state.item;
  },

  componentWillMount: function() {
    var validationConfiguration = this.state.newItem ?
      this.getResource().getCreateValidationConfiguration() :
      this.getResource().getEditValidationConfiguration();

    this.validity = validator.validate(this.state.item, validationConfiguration);
  },

  componentDidMount: function() {
    this.reloadData();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.resource !== this.props.resource || nextProps.id !== this.props.id) {
      this.hideAllErrorMessages();

      var nextState = this.getInitialState(nextProps);
      this.setState(nextState);

      this.reloadData(nextState, nextProps);
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    var validationConfiguration = nextState.newItem ?
      nextProps.resource.getCreateValidationConfiguration() :
      nextProps.resource.getEditValidationConfiguration();

    this.validity = validator.validate(nextState.item, validationConfiguration);
  },

  getErrorMessagesConfig: function() {
    return this.state.newItem ?
      this.getResource().getCreateErrorMessagesConfiguration() :
      this.getResource().getEditErrorMessagesConfiguration();
  },

  cloneItem: function(item) {
    var properties = this.state.newItem ?
      this.props.resource.getCreateFormProperties() :
      this.props.resource.getEditFormProperties();

    item = properties.reduce(function(itemClone, property) {

      var dependency = property.getDependency();

      if (dependency) {
        var mapper = function(i) {
          if (typeof i === 'object') {
            return i[dependency.getIdProperty()];
          } else {
            return i;
          }
        };

        if (Array.isArray(item[property.getId()])) {
          itemClone[property.getId()] = item[property.getId()].map(mapper);
        } else {
          itemClone[property.getId()] = mapper(item[property.getId()]);
        }
      } else {
        itemClone[property.getId()] = item[property.getId()];
      }

      return itemClone;
    }, {});

    if (this.prepareItem) {
      item = this.prepareItem(item);
    }

    return item;
  },

  reloadData: function(state, props) {
    state = state || this.state;
    props = props || this.props;

    var itemLoaded = !!state.newItem;

    var dependencies = state.newItem ?
      props.resource.getCreateFormDependencies() :
      props.resource.getEditFormDependencies();

    var dependenciesWaiting = dependencies.length;

    var errorHandler = function() {
        this.setState({
          loading: false,
          error: true
        });
    }.bind(this);

    if (!itemLoaded) {
      props.resource.getStorage().readOne(props.id)
        .then(function(output) {
          var item = output.data;
          var itemClone = this.cloneItem(item);

          itemLoaded = true;

          this.setState({
            loading: !itemLoaded || dependenciesWaiting > 0,
            item: itemClone
          });
        }.bind(this), errorHandler);
    }

    dependencies.forEach(function(dependency) {
      dependency.getStorage().readAll()
        .then(function(output) {
          this.state.dependencies[dependency.getId()] = output.data;

          dependenciesWaiting -= 1;

          this.setState({
            loading: !itemLoaded || dependenciesWaiting > 0
          })
        }.bind(this), errorHandler);
    }, this);
  },

  save: function(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (this.validity.invalid) {
      return this.showAllErrorMessages();
    }

    var data = this.state.item;
    var request;

    if (this.state.newItem) {
      request = function() {
        return this.getResource().getStorage().create(null, {data: data});
      }.bind(this);
    } else {
      request = function() {
        return this.getResource().getStorage().update(this.props.id, null, {data: data});
      }.bind(this);
    }

    this.setState({loading: true}, function() {
      request().then(function(output) {
        if (this.state.newItem) {
          window.location.hash = '#!' + this.getViewUrl(output.data);
        } else {
          var itemClone = this.cloneItem(output.data);

          this.setState({
            loading: false,
            item: itemClone
          });
        }
      }.bind(this), function() {
        this.setState({
          error: true,
          loading: false
        });
      }.bind(this));
    }.bind(this));
  },

  linkItemProperty: function(property) {
    return {
      value: this.state.item[property.getId()],
      requestChange: function(value) {
        this.state.item[property.getId()] = value;
        this.setErrorMessageInputChanged(property.getId());
        this.forceUpdate();
      }.bind(this)
    };
  },

  renderControl: function(property) {
    var control = property.getComponent();
    var dependency = property.getDependency();

    return control({
      property: property,
      resource: this.getResource(),
      dependency: dependency,
      dependencyItems: dependency ? this.state.dependencies[dependency.getId()] : null,
      valueLink: this.linkItemProperty(property),
      validity: this.validity[property.getId()] || {
        valid: true,
        invalid: false
      },
      setErrorMessageInputBlured: this.getErrorMessageInputBluredSetter(property.getId())
    });
  }
};

module.exports = ResourceFormMixin;
