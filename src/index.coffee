_ = require('underscore')

_.extend(
    exports,
    require('./shared'),
    require('./logger'),
    require('./string')
)

exports.inflector = require('./inflector')
