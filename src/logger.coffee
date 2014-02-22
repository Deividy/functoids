if (require?)
    util = require('util')
    _ = require('underscore')
else
    { _ } = @

inspect = (obj) ->
    return util.inspect(obj) if (util?.inspect?)
    return obj

timestamp = () ->
    d = (new Date()).toISOString()
    return "[#{d}] - "

ensureString = (message) ->
    return if _.isString(message) then message else inspect(message)

stdout = () ->
	return process.stdout.write.apply(@, arguments) if process?.stdout?
	console.log.apply(@, arguments)

stderr = () ->
	return process.stderr.write.apply(@, arguments) if process?.stderr?
	console.error.apply(@, arguments)

isTTYout = Boolean(stdout.isTTY)
isTTYerr = Boolean(stderr.isTTY)

LABEL_INFO = if (isTTYout) then "\x1b[36m[info]\x1b[0m" else ''
LABEL_ERROR = if (isTTYerr) then "\x1b[31m[error]\x1b[0m" else ''

self = {

    logAll: (message) ->
        message =  ensureString(message)
        message = LABEL_INFO + timestamp() + message

        stdout("#{message}\n")
        stderr("#{message}\n")


    logInfo: (info, context) ->
        params = [
            LABEL_INFO + timestamp() + ensureString(info)
        ]
        
        if context?
            params.push(inspect(context))

        params.push('')

        stdout(params.join('\n'))


    logError: (error, context) ->
        params = []

        message = LABEL_ERROR + timestamp()
        if (error instanceof Error)
            message += error.message
            stack = error.stack
        else
            message += ensureString(error)
            stack = (new Error()).stack

        params = [message, stack]

        if context?
            params.push(inspect(context))

        params.push('')

        stderr(params.join('\n'))

}


if (module?.exports?)
    module.exports = self
else
    _.extend(@F, self)
