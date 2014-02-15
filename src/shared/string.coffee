###

Much of this code and all of the good ideas were taken from the Sugar JS library
Copyright (c) Andrew Plummer, http://sugarjs.com/

Modifications Copyright(c) Gustavo Duarte
 
###

if (require?)
    _ = require('underscore')
    F = require('./index')
else
    { F, _ } = @

delimiters = ["''", '""', '{}', '[]', '()']

# this is from http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
# I haven't tested it much yet
rgxStripHtml = /<(?:.|\n)*?>/gm

self = {
    delimiters,

    tryUpper: (s) -> if _.isString(s) then s.toUpperCase() else s
    tryLower: (s) -> if _.isString(s) then s.toLowerCase() else s

    toUpperInitial: (s) ->
        c = s.charAt(0).toUpperCase()
        return if s.length == 1 then c else c + s.slice(1)

    toLowerInitial: (s) ->
        c = s.charAt(0).toLowerCase()
        return if s.length == 1 then c else c + s.slice(1)

    undelimit: (s, args...) ->
        pairs = if args.length > 0 then args else delimiters
        for d in pairs
            if s.charAt(0) == d.charAt(0) && s.charAt(s.length-1) == d.charAt(1)
                return s.slice(1, s.length-1)
        return s

    stripHtml: (s) ->
        F.demandGoodString(s, "s")
        return s.replace(rgxStripHtml, '')

    # Thanks to Jason Orendorff
    # http://stackoverflow.com/questions/1877475/repeat-character-n-times
    repeat: (str, n) -> Array(n+1).join(str)

    padLeft: (s, length, pad = ' ') ->
        s = s.toString()
        return s if s.length >= length
        return self.repeat(pad, length - s.length) + s

    # Thanks to Chakrit Wichian
    # http://stackoverflow.com/questions/280634/endswith-in-javascript
    endsWith: (str, suffix) ->
        F.demandGoodString(str, 'str')
        F.demandGoodString(suffix, 'suffix')
        return str.indexOf(suffix, str.length - suffix.length) != -1

    startsWith: (str, prefix) ->
        F.demandGoodString(str, 'str')
        F.demandGoodString(prefix, 'prefix')
        return (str.slice(0, prefix.length) == prefix)

    alike: (a, b) ->
        a ?= ''
        b ?= ''

        F.demandString(a, 'a')
        F.demandString(b, 'b')

        a = a.toLowerCase().trim()
        b = b.toLowerCase().trim()

        return a == b
}

module.exports = self
