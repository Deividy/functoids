// Generated by CoffeeScript 1.6.3
(function() {
  var F, i, self, _;

  if ((typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
    F = require('./index');
    i = require('../inflector');
  } else {
    F = this.F, _ = this._;
    i = F.inflector;
  }

  self = {
    "throw": function() {
      var msg;
      msg = Array.prototype.join.call(arguments, ' ');
      throw new Error(msg);
    },
    result: function(arg1, arg2) {
      var v;
      if (arg2 != null) {
        F.demandObject(arg1, "arg1");
        F.demandGoodString(arg2, "arg2");
        v = arg1[arg2];
        if (_.isFunction(v)) {
          return v.call(arg1);
        } else {
          return v;
        }
      }
      if (_.isFunction(arg1)) {
        return arg1();
      } else {
        return arg1;
      }
    }
  };

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = self;
  } else {
    _.extend(this.F, self);
  }

}).call(this);