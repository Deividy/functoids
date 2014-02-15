if (require?)
    _ = require('underscore')
else
    { _ } = @

self = {
    throw: () ->
        msg = Array::join.call(arguments, ' ')
        throw new Error(msg)
}

if (module?.exports?)
    module.exports = self
else
    _.extend(@F, self)
