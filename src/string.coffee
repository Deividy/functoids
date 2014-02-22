###

Much of this code and all of the good ideas were taken from the Sugar JS library
Copyright (c) Andrew Plummer, http://sugarjs.com/

Modifications Copyright(c) Gustavo Duarte
 
###

if (require?)
    _ = require('underscore')
    F = require('./index')
    i = require('../inflector')
else
    { F, _ } = @
    i = F.inflector

delimiters = ["''", '""', '{}', '[]', '()']

# this is from http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
# I haven't tested it much yet
rgxStripHtml = /<(?:.|\n)*?>/gm

self = {
    delimiters,

    toPlural: (s) -> i.inflect(s, true)

    toSingular: (s) -> i.inflect(s, false)

    ###
     * @method underscore()
     * @short Converts hyphens and camel casing to underscores.
     ###
    underscore: (s) ->
      return s
        .replace(/[-\s]+/g, '_')
        .replace(i.acronymRegExp, (fullMatch, acronym, index) ->
            (if index > 0 then '_' else '') + acronym.toLowerCase()
        )
        .replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
        .replace(/([a-z\d])([A-Z])/g,'$1_$2')
        .toLowerCase()

    spacify: (s) -> self.underscore(s).replace(/_/g, ' ')

    toCamelCase: (s, first) ->
      return self.underscore(s).replace(/(^|_)([^_]+)/g, (match, pre, word, index) ->
            acronym = i.acronyms[word]
            toUpperInitial = first != false || index > 0
            
            if(acronym)
                return if toUpperInitial then acronym else acronym.toLowerCase()

            return if toUpperInitial then F.toUpperInitial(word) else word
      ) 

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
        F.demandString(s, "s")
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

if (module?.exports?)
    module.exports = self
else
    _.extend(@F, self)
