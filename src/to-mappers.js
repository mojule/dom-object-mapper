'use strict'

const utils = require( './utils' )

const { primitive } = utils

const mappers = {
  string: ( value, document ) => primitive( 'string', value, document ),
  number: ( value, document ) => primitive( 'number', value, document ),
  boolean: ( value, document ) => primitive( 'boolean', value, document ),
  null: ( value, document ) => document.createElement( 'null' ),
  array: ( value, document, toElement ) => {
    const el = document.createElement( 'array' )

    value.forEach( current =>
      el.appendChild( toElement( current, null, document ) )
    )

    return el
  },
  object: ( value, document, toElement ) => {
    const el = document.createElement( 'object' )

    Object.keys( value ).forEach( propertyName =>
      el.appendChild( toElement( value[ propertyName ], propertyName, document ) )
    )

    return el
  }
}

module.exports = mappers
