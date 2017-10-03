'use strict'

const Is = require( '@mojule/is' )
const from = require( '../../src/from-mappers' )
const to = require( '../../src/to-mappers' )

const predicates = {
  date: value => value instanceof Date,
  buffer: value => value instanceof Buffer
}

const is = Is( predicates )

const primitive = ( type, value, document ) => {
  const el = document.createElement( type )
  const text = document.createTextNode( value )

  el.appendChild( text )

  return el
}

const getTextValue = el => {
  if( el.firstChild && el.firstChild.nodeType === 3 )
    return el.firstChild.nodeValue

  return ''
}

to.date = ( value, document ) => primitive( 'date', value.toJSON(), document )
from.date = el => new Date( getTextValue( el ) )

to.buffer = ( value, document ) => primitive( 'buffer', value.toString( 'base64' ), document )
from.buffer = el => Buffer.from( getTextValue( el ), 'base64' )

module.exports = { is, mappers: { from, to } }
