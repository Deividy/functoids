(function() {
  var F, LABEL_ERROR, LABEL_INFO, argumentError, delimiters, ensureString, i, inspect, isTTYerr, isTTYout, rgxNonWhitespace, rgxStripHtml, self, stderr, stdout, timestamp, util, validator, _,
    __slice = [].slice;

  if (typeof exports === 'undefined') {
    if (this.F == null) {
      this.F = {};
    }
  } else {
    _ = require('underscore');
    _.extend(exports, require('./validator'), require('./core'), require('./math'), require('./array'), require('./string'), require('./logger'));
    exports.inflector = require('../inflector');
  }

  if (typeof require !== "undefined" && require !== null) {
    _ = require('underscore');
  } else {
    _ = this._;
  }

  argumentError = function(demand, argName, customMsg) {
    var s;
    s = ["Argument ", argName != null ? "'" + argName + "' " : "", "must ", customMsg != null ? customMsg : demand].join('');
    throw new Error(s);
  };

  rgxNonWhitespace = /\S/;

  validator = {
    demandNotNil: function(a, argName, customMsg) {
      if (a != null) {
        return true;
      }
      return argumentError("not be null or undefined", argName, customMsg);
    },
    demandNonEmpty: function(a, argName, customMsg) {
      if (_.isArray(a)) {
        return validator.isGoodArray(a);
      }
    },
    demandArray: function(a, argName, customMsg) {
      if (_.isArray(a)) {
        return true;
      }
      return argumentError("be an array", argName, customMsg);
    },
    demandNonEmptyArray: function(a, argName, customMsg) {
      if (_.isArray(a) && !_.isEmpty(a)) {
        return true;
      }
      return argumentError("be a non-empty array", argName, customMsg);
    },
    demandGoodArray: function(a, argName, customMsg) {
      if (validator.isGoodArray(a)) {
        return true;
      }
      return argumentError("be a non-empty array free of nil elements", argName, customMsg);
    },
    demandArrayOfStrings: function(a, argName, customMsg) {
      if (validator.isArrayOfStrings(a)) {
        return true;
      }
      return argumentError("be an array of strings", argName, customMsg);
    },
    demandArrayOfGoodStrings: function(a, argName, customMsg) {
      if (validator.isArrayOfGoodStrings(a)) {
        return true;
      }
      return argumentError("be an array of non-empty, non-all-whitespace strings", argName, customMsg);
    },
    demandArrayOfGoodNumbers: function(a, argName, customMsg) {
      if (validator.isArrayOfGoodNumbers(a)) {
        return true;
      }
      return argumentError("be an array of non-infinity, non-NaN numbers", argName, customMsg);
    },
    demandObject: function(o, argName, customMsg) {
      if (_.isObject(o)) {
        return true;
      }
      return argumentError("be an object", argName, customMsg);
    },
    demandGoodObject: function(o, argName, customMsg) {
      if (validator.isGoodObject(o)) {
        return true;
      }
      return argumentError("be a defined, non-empty object", argName, customMsg);
    },
    demandType: function(o, t, argName, customMsg) {
      if (validator.isOfType(o, t)) {
        return true;
      }
      return argumentError("be an object of type '" + (t.name || t) + "'", argName, customMsg);
    },
    demandKeys: function(o, keys, argName, customMsg) {
      var expectedKeys;
      if (validator.hasKeys(o, keys)) {
        return true;
      }
      expectedKeys = keys.join(", ");
      return argumentError("be a defined object containing [" + expectedKeys + "] key(s)", argName, customMsg);
    },
    demandHash: function(o, argName, customMsg) {
      if (validator.isHash(o)) {
        return true;
      }
      return argumentError("be a non-empty, non-array object (ie, a hash)", argName, customMsg);
    },
    demandFunction: function(f, argName, customMsg) {
      if (_.isFunction(f)) {
        return true;
      }
      return argumentError("be a function", argName, customMsg);
    },
    demandString: function(s, argName, customMsg) {
      if (_.isString(s)) {
        return true;
      }
      return argumentError("be a string", argName, customMsg);
    },
    demandGoodString: function(s, argName, customMsg) {
      if (validator.isGoodString(s)) {
        return true;
      }
      return argumentError("be a non-empty, non-all-whitespace string", argName, customMsg);
    },
    demandNumber: function(n, argName, customMsg) {
      if (_.isNumber(n)) {
        return true;
      }
      return argumentError("be a number", argName, customMsg);
    },
    demandGoodNumber: function(n, argName, customMsg) {
      if (validator.isGoodNumber(n)) {
        return true;
      }
      return argumentError("be a number", argName, customMsg);
    },
    demandBoolean: function(b, argName, customMsg) {
      if (_.isBoolean(b)) {
        return true;
      }
      return argumentError("be a boolean value", argName, customMsg);
    },
    demandDate: function(d, argName, customMsg) {
      if (_.isDate(d)) {
        return true;
      }
      return argumentError("be a Date", argName, customMsg);
    },
    isHash: function(h) {
      return _.isObject(h) && !_.isEmpty(h) && !_.isArray(h);
    },
    isGoodObject: function(o) {
      return _.isObject(o) && !_.isEmpty(o);
    },
    hasKeys: function(o, keys) {
      validator.demandArrayOfGoodStrings(keys, "keys");
      if (!validator.isGoodObject(o)) {
        return false;
      }
      return _.every(keys, function(k) {
        return k in o;
      });
    },
    isGoodArray: function(a) {
      var e, _i, _len;
      if (!(_.isArray(a) && !_.isEmpty(a))) {
        return false;
      }
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        e = a[_i];
        if (e == null) {
          return false;
        }
      }
      return true;
    },
    isGoodString: function(s) {
      if (!(_.isString(s) && s.length > 0)) {
        return false;
      }
      return rgxNonWhitespace.test(s);
    },
    isGoodNumber: function(n) {
      return _.isNumber(n) && _.isFinite(n) && !isNaN(n);
    },
    isArrayOfStrings: function(a) {
      var s, _i, _len;
      if (!_.isArray(a)) {
        return false;
      }
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        s = a[_i];
        if (!_.isString(s)) {
          return false;
        }
      }
      return true;
    },
    isArrayOfGoodStrings: function(a) {
      var s, _i, _len;
      if (!_.isArray(a)) {
        return false;
      }
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        s = a[_i];
        if (!validator.isGoodString(s)) {
          return false;
        }
      }
      return true;
    },
    isArrayOfGoodNumbers: function(a) {
      var n, _i, _len;
      if (!_.isArray(a)) {
        return false;
      }
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        n = a[_i];
        if (!validator.isGoodNumber(n)) {
          return false;
        }
      }
      return true;
    },
    isOfType: function(o, t) {
      validator.demandFunction(t, "t");
      return o instanceof t;
    }
  };

  validator.demandNonEmptyObject = validator.demandGoodObject;

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = validator;
  } else {
    _.extend(this.F, validator);
  }

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

  if ((typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
    F = require('./index');
  } else {
    F = this.F, _ = this._;
  }

  self = {
    evenRound: function(num, decimalPlaces) {
      var d, f, m, n, r;
      F.demandGoodNumber(num, "num");
      d = decimalPlaces || 0;
      m = Math.pow(10, d);
      n = +(d ? num * m : num).toFixed(8);
      i = Math.floor(n);
      f = n - i;
      if (f === 0.5) {
        r = i % 2 === 0 ? i : i + 1;
      } else {
        r = Math.round(n);
      }
      if (d) {
        return r / m;
      } else {
        return r;
      }
    },
    round: function(num, decimalPlaces) {
      F.demandGoodNumber(num, "num");
      return Number(num.toFixed(decimalPlaces));
    }
  };

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = self;
  } else {
    _.extend(this.F, self);
  }

  if ((typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
    F = require('./index');
  } else {
    F = this.F, _ = this._;
  }

  self = {
    isOnlyElement: function(a, e) {
      return _.isArray(a) && a.length === 1 && a[0] === e;
    },
    firstOrSelf: function(a) {
      if (_.isArray(a)) {
        return a[0];
      } else {
        return a;
      }
    },
    secondOrNull: function(a) {
      var _ref;
      if (_.isArray(a)) {
        return (_ref = a[1]) != null ? _ref : null;
      } else {
        return null;
      }
    },
    popIfObject: function(a) {
      if (_.isArray(a) && _.isObject(a[a.length - 1])) {
        return a.pop();
      } else {
        return null;
      }
    },
    popIfNull: function(a) {
      if (_.isArray(a) && a[a.length - 1] === null) {
        return a.pop();
      }
    },
    pluckMany: function() {
      var arr, item, k, keys, results, _i, _j, _len, _len1;
      arr = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      F.demandArray(arr, "arr");
      F.demandArrayOfGoodStrings(keys, "keys");
      results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          k = keys[_j];
          if (k in item) {
            results.push(F.result(item, k));
          }
        }
      }
      return results;
    },
    toDictionary: function(a, key) {
      var e, o, v, _i, _len;
      F.demandArray(a, a);
      F.demandGoodString(key, "key");
      o = {};
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        e = a[i];
        v = e[key];
        if (v == null) {
          F["throw"]("Element " + e + " at position " + i + " has nil '" + key + "'");
        }
        if (v in o) {
          F["throw"]("Element " + e + " at position " + i + " has repeat value '" + v + "' for '" + key + "'");
        }
        o[v] = e;
      }
      return o;
    },
    unwrapSingle: function(a) {
      if (_.isArray(a) && a.length === 1) {
        return a[0];
      } else {
        return a;
      }
    },
    lastIfFunction: function(a) {
      var idx, last;
      idx = a.length - 1;
      if (idx >= 0) {
        last = a[idx];
        if (_.isFunction(last)) {
          return last;
        }
      }
      return null;
    },
    unwrapArgs: function(args, skipLast) {
      var a, len;
      len = skipLast ? args.length - 1 : args.length;
      if (len <= 0) {
        return null;
      }
      if (len === 1) {
        return args[0];
      }
      a = Array(len);
      i = 0;
      while (i < len) {
        a[i] = args[i];
        i++;
      }
      return a;
    }
  };

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = self;
  } else {
    _.extend(this.F, self);
  }


  /*
  
  Much of this code and all of the good ideas were taken from the Sugar JS library
  Copyright (c) Andrew Plummer, http://sugarjs.com/
  
  Modifications Copyright(c) Gustavo Duarte
   */

  if ((typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
    F = require('./index');
    i = require('../inflector');
  } else {
    F = this.F, _ = this._;
    i = F.inflector;
  }

  delimiters = ["''", '""', '{}', '[]', '()'];

  rgxStripHtml = /<(?:.|\n)*?>/gm;

  self = {
    delimiters: delimiters,
    toPlural: function(s) {
      return i.inflect(s, true);
    },
    toSingular: function(s) {
      return i.inflect(s, false);
    },

    /*
     * @method underscore()
     * @short Converts hyphens and camel casing to underscores.
     */
    underscore: function(s) {
      return s.replace(/[-\s]+/g, '_').replace(i.acronymRegExp, function(fullMatch, acronym, index) {
        return (index > 0 ? '_' : '') + acronym.toLowerCase();
      }).replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
    },
    spacify: function(s) {
      return self.underscore(s).replace(/_/g, ' ');
    },
    toCamelCase: function(s, first) {
      return self.underscore(s).replace(/(^|_)([^_]+)/g, function(match, pre, word, index) {
        var acronym, toUpperInitial;
        acronym = i.acronyms[word];
        toUpperInitial = first !== false || index > 0;
        if (acronym) {
          if (toUpperInitial) {
            return acronym;
          } else {
            return acronym.toLowerCase();
          }
        }
        if (toUpperInitial) {
          return F.toUpperInitial(word);
        } else {
          return word;
        }
      });
    },
    tryUpper: function(s) {
      if (_.isString(s)) {
        return s.toUpperCase();
      } else {
        return s;
      }
    },
    tryLower: function(s) {
      if (_.isString(s)) {
        return s.toLowerCase();
      } else {
        return s;
      }
    },
    toUpperInitial: function(s) {
      var c;
      c = s.charAt(0).toUpperCase();
      if (s.length === 1) {
        return c;
      } else {
        return c + s.slice(1);
      }
    },
    toLowerInitial: function(s) {
      var c;
      c = s.charAt(0).toLowerCase();
      if (s.length === 1) {
        return c;
      } else {
        return c + s.slice(1);
      }
    },
    undelimit: function() {
      var args, d, pairs, s, _i, _len;
      s = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      pairs = args.length > 0 ? args : delimiters;
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        d = pairs[_i];
        if (s.charAt(0) === d.charAt(0) && s.charAt(s.length - 1) === d.charAt(1)) {
          return s.slice(1, s.length - 1);
        }
      }
      return s;
    },
    stripHtml: function(s) {
      F.demandString(s, "s");
      return s.replace(rgxStripHtml, '');
    },
    repeat: function(str, n) {
      return Array(n + 1).join(str);
    },
    padLeft: function(s, length, pad) {
      if (pad == null) {
        pad = ' ';
      }
      s = s.toString();
      if (s.length >= length) {
        return s;
      }
      return self.repeat(pad, length - s.length) + s;
    },
    endsWith: function(str, suffix) {
      F.demandGoodString(str, 'str');
      F.demandGoodString(suffix, 'suffix');
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    startsWith: function(str, prefix) {
      F.demandGoodString(str, 'str');
      F.demandGoodString(prefix, 'prefix');
      return str.slice(0, prefix.length) === prefix;
    },
    alike: function(a, b) {
      if (a == null) {
        a = '';
      }
      if (b == null) {
        b = '';
      }
      F.demandString(a, 'a');
      F.demandString(b, 'b');
      a = a.toLowerCase().trim();
      b = b.toLowerCase().trim();
      return a === b;
    }
  };

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = self;
  } else {
    _.extend(this.F, self);
  }

  if ((typeof require !== "undefined" && require !== null)) {
    util = require('util');
    _ = require('underscore');
  } else {
    _ = this._;
  }

  inspect = function(obj) {
    if (((util != null ? util.inspect : void 0) != null)) {
      return util.inspect(obj);
    }
    return obj;
  };

  timestamp = function() {
    var d;
    d = (new Date()).toISOString();
    return "[" + d + "] - ";
  };

  ensureString = function(message) {
    if (_.isString(message)) {
      return message;
    } else {
      return inspect(message);
    }
  };

  stdout = function() {
    if ((typeof process !== "undefined" && process !== null ? process.stdout : void 0) != null) {
      return process.stdout.write.apply(this, arguments);
    }
    return console.log.apply(this, arguments);
  };

  stderr = function() {
    if ((typeof process !== "undefined" && process !== null ? process.stderr : void 0) != null) {
      return process.stderr.write.apply(this, arguments);
    }
    return console.error.apply(this, arguments);
  };

  isTTYout = Boolean(stdout.isTTY);

  isTTYerr = Boolean(stderr.isTTY);

  LABEL_INFO = isTTYout ? "\x1b[36m[info]\x1b[0m" : '';

  LABEL_ERROR = isTTYerr ? "\x1b[31m[error]\x1b[0m" : '';

  self = {
    logAll: function(message) {
      message = ensureString(message);
      message = LABEL_INFO + timestamp() + message;
      stdout("" + message + "\n");
      return stderr("" + message + "\n");
    },
    logInfo: function(info, context) {
      var params;
      params = [LABEL_INFO + timestamp() + ensureString(info)];
      if (context != null) {
        params.push(inspect(context));
      }
      params.push('');
      return stdout(params.join('\n'));
    },
    logError: function(error, context) {
      var message, params, stack;
      params = [];
      message = LABEL_ERROR + timestamp();
      if (error instanceof Error) {
        message += error.message;
        stack = error.stack;
      } else {
        message += ensureString(error);
        stack = (new Error()).stack;
      }
      params = [message, stack];
      if (context != null) {
        params.push(inspect(context));
      }
      params.push('');
      return stderr(params.join('\n'));
    }
  };

  if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
    module.exports = self;
  } else {
    _.extend(this.F, self);
  }

}).call(this);
