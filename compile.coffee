#!/usr/bin/env coffee

fs = require('fs')
{ exec } = require('child_process')

sharedSrc = "#{__dirname}/src/shared"
jsClientFile = "#{__dirname}/functoids-client.js"

sharedFiles = [ ]

for file in [ 'index', 'validator', 'core', 'math', 'array', 'string' ]
    sharedFiles.push("#{sharedSrc}/#{file}.coffee")

console.log("Compiling client: \n#{sharedFiles.join('\n')}\n To: \n#{jsClientFile}")

exec("coffee -cj #{jsClientFile} #{sharedFiles.join(' ')}", (err) ->
    throw new Error(err) if err?
)
