// Generated by CoffeeScript 1.6.3
(function() {
  var _;

  if (typeof exports === 'undefined') {
    if (this.F == null) {
      this.F = {};
    }
  } else {
    _ = require('underscore');
    _.extend(exports, require('./validator'), require('./core'), require('./math'), require('./array'), require('./string'), require('./logger'));
    exports.inflector = require('../inflector');
  }

}).call(this);