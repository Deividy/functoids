#!/usr/bin/env coffee

fs = require('fs')
{ exec } = require('child_process')

src = "#{__dirname}/src"
file = "#{__dirname}/functoids.js"

files = [ ]

for f in [ 'index', 'validator', 'core', 'math', 'array', 'string', 'logger' ]
    files.push("#{src}/#{f}.coffee")

console.log("Compiling: \n#{files.join('\n')}\n To: \n#{file}")

exec("coffee -cj #{file} #{files.join(' ')}", (err) ->
    throw new Error(err) if err?
)
