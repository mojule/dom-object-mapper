'use strict'

const is = require( '@mojule/is' )
const utils = require( '../../src/utils' )
let from = require( '../../src/from-mappers' )

const { primitive, getTextValue } = utils

const to = {
  string: ( value, document ) => primitive( 'm-string', value, document ),
  number: ( value, document ) => primitive( 'm-number', value, document ),
  boolean: ( value, document ) => primitive( 'm-boolean', value, document ),
  null: ( value, document ) => document.createElement( 'm-null' ),
  array: ( value, document, toElement ) => {
    const el = document.createElement( 'm-array' )

    value.forEach( current =>
      el.appendChild( toElement( current, null, document ) )
    )

    return el
  },
  object: ( value, document, toElement ) => {
    const el = document.createElement( 'm-object' )

    Object.keys( value ).forEach( propertyName =>
      el.appendChild( toElement( value[ propertyName ], propertyName, document ) )
    )

    return el
  }
}

from = Object.keys( from ).reduce( ( obj, key ) => {
  obj[ 'm-' + key ] = from[ key ]

  return obj
}, {} )

module.exports = { from, to }
