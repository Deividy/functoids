#!/usr/bin/env coffee

src = "#{__dirname}/src/shared"
compiledJS = "#{__dirname}/js/functoids-client.js"

fs = require('fs')
{ exec } = require('child_process')
FShared = require(src)

importOrder = FShared._importOrder

importOrder.unshift('index')
files = ("#{src}/#{file}.coffee" for file in importOrder)

console.log("Compiling: \n#{files.join('\n')}\n To: \n#{compiledJS}")

exec("coffee -cj #{compiledJS} #{files.join(' ')}", (err) ->
    throw new Error(err) if err?
)
