importOrder = [ 'validator', 'core', 'math', 'array', 'string' ]

if typeof exports == 'undefined'
    @F = { }
else
    _ = require('underscore')
    _.extend(exports, require("./#{module}")) for module in importOrder

    exports._importOrder = importOrder
