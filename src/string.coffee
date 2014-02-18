###

Much of this code and all of the good ideas were taken from the Sugar JS library
Copyright (c) Andrew Plummer, http://sugarjs.com/

Modifications Copyright(c) Gustavo Duarte
 
###

_ = require('underscore')
F = require('./index')
i = require('./inflector')

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
}

module.exports = self
