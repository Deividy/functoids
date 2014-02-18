_ = require('underscore')
F = require('./index')
root = @


self = {
    throw: () ->
        msg = Array::join.call(arguments, ' ')
        throw new Error(msg)

    result: (arg1, arg2) ->
        if arg2?
            F.demandObject(arg1, "arg1")
            F.demandGoodString(arg2, "arg2")
            v = arg1[arg2]

            return if _.isFunction(v) then v.call(arg1) else v
         
        if _.isFunction(arg1) then arg1() else arg1
}

module.exports = self
