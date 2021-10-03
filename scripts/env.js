'use strict'

const config = require('./app.config')

require('dotenv').config({path: config.dotenv})

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.')
}

module.exports = function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => /^APP_/.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
      }
    )
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }
  return {raw, stringified}
}
