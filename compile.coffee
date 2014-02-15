#!/usr/bin/env coffee

src = "#{__dirname}/src"
compiledJSClient = "#{__dirname}/js/functoids-client.js"
compiledJSFull = "#{__dirname}/js/functoids-full.js"

fs = require('fs')
{ exec } = require('child_process')
FShared = require(src)

sharedFiles = FShared._sharedFiles

sharedFiles.unshift('index')
sharedFiles = ("#{src}/shared/#{file}.coffee" for file in sharedFiles)

console.log("Compiling client: \n#{sharedFiles.join('\n')}\n To: \n#{compiledJSClient}")

exec("coffee -cj #{compiledJSClient} #{sharedFiles.join(' ')}", (err) ->
    throw new Error(err) if err?
)
