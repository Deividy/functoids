if (require?)
    _ = require('underscore')
    F = require('./index')
else
    { F, _ } = @

self = {
    isOnlyElement: (a, e) -> _.isArray(a) && a.length == 1 && a[0] == e

    firstOrSelf: (a) -> if _.isArray(a) then a[0] else a

    secondOrNull: (a) -> if _.isArray(a) then a[1] ? null else null

    popIfObject: (a) -> if _.isArray(a) && _.isObject(a[a.length - 1]) then a.pop() else null

    popIfNull: (a) -> a.pop() if _.isArray(a) && a[a.length - 1] == null

    pluckMany: (arr, keys...) ->
        F.demandArray(arr, "arr")
        F.demandArrayOfGoodStrings(keys, "keys")

        results = []
        for item in arr
            for k in keys
                if k of item
                    results.push(F.result(item, k))

        return results

    toDictionary: (a, key) ->
        F.demandArray(a, a)
        F.demandGoodString(key, "key")

        o = {}
        for e, i in a
            v = e[key]

            unless v?
                F.throw("Element #{e} at position #{i} has nil '#{key}'")

            if v of o
                F.throw("Element #{e} at position #{i} has repeat value '#{v}' for '#{key}'")

            o[v] = e

        return o

    unwrapSingle: (a) -> if _.isArray(a) && a.length == 1 then a[0] else a

    # lastIfFunction and unwrapArgs offer argument processing while trying to minimize creation of
    # arrays. This avoids expensive heap allocations in functions that are called very frequently.
    # This is more friendly to the VM than indiscriminately calling slice() on arguments, using
    # [].concat(), or using Coffee's splats
    lastIfFunction: (a) ->
        idx = a.length - 1
        if idx >= 0
            last = a[idx]
            return last if _.isFunction(last)

        return null

    unwrapArgs: (args, skipLast) ->
        len = if skipLast then args.length - 1 else args.length

        return null if len <= 0
        return args[0] if len == 1
        
        # See http://jsperf.com/args2array
        a = Array(len)
        i = 0
        while i < len
            a[i] = args[i]
            i++

        return a
}

if (module?.exports?)
    module.exports = self
else
    _.extend(@F, self)
