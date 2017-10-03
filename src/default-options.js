'use strict'

const is = require( '@mojule/is' )
const to = require( './to-mappers' )
const from = require( './from-mappers' )

const options = { strict: true, is, mappers: { to, from } }

module.exports = options
