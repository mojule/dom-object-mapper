'use strict'

const is = require( '@mojule/is' )
const toMappers = require( './to-mappers' )
const fromMappers = require( './from-mappers' )

const mappers = {
  to: toMappers,
  from: fromMappers
}

const options = {
  strict: true,
  is,
  mappers
}

module.exports = options
