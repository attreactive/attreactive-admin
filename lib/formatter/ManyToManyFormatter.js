/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");

var ManyToManyFormatter = Formatter.extend({
  format: function(value, dependencyResource, dependencies) {
    if (!Array.isArray(value)) return 'Invalid array';

    dependencies = dependencies.reduce(function(dependencies, dependency) {
      dependencies[dependency[dependencyResource.getIdProperty()]] = dependency;

      return dependencies;
    }, {});

    return value.map(function(id) {
      return dependencyResource.stringify(dependencies[id]);
    }).join(', ');
  }
});

module.exports = ManyToManyFormatter;
