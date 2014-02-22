if typeof exports == 'undefined'
    @F ?= { }
else
    _ = require('underscore')

    _.extend(exports,
        require('./validator'),
        require('./core'),
        require('./math'),
        require('./array'),
        require('./string'),
        require('./logger')
    )

    exports.inflector = require('../inflector')
