#!/usr/bin/env coffee

src = "#{__dirname}/src/shared"
compiledJS = "#{__dirname}/client/functoids.js"

fs = require('fs')
{ exec } = require('child_process')
FShared = require(src)

importOrder = FShared._importOrder

files = ""

files += "#{src}/#{file}.coffee " for file in importOrder

console.log("Compiling #{files} to #{compiledJS}")

exec("coffee -cj #{compiledJS} #{files}", (err, stdout) ->
    throw new Error(err) if err?
)
