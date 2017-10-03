'use strict'

const Is = require( '@mojule/is' )
const from = require( '../../src/from-mappers' )
const to = require( '../../src/to-mappers' )
const utils = require( '../../src/utils' )

const { primitive, getTextValue } = utils

const predicates = {
  date: value => value instanceof Date,
  buffer: value => value instanceof Buffer
}

const is = Is( predicates )

to.date = ( value, document ) => primitive( 'date', value.toJSON(), document )
from.date = el => new Date( getTextValue( el ) )

to.buffer = ( value, document ) => primitive( 'buffer', value.toString( 'base64' ), document )
from.buffer = el => Buffer.from( getTextValue( el ), 'base64' )

module.exports = { is, mappers: { from, to } }
