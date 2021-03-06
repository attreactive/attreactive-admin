/**
 * AttrEactive Admin
 */

var Formatter = require("./Formatter");

var ManyToOneFormatter = Formatter.extend({
  format: function(value, dependencyResource, dependencies) {
    if (value === null || value === undefined) return '—';

    dependencies = dependencies.reduce(function(dependencies, dependency) {
      dependencies[dependency[dependencyResource.getIdProperty()]] = dependency;

      return dependencies;
    }, {});

    return dependencyResource.stringify(dependencies[value]);
  }
});

module.exports = ManyToOneFormatter;
