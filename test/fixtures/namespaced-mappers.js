'use strict'

const is = require( '@mojule/is' )

const primitive = ( type, value, document ) => {
  const el = document.createElement( type )
  const text = document.createTextNode( value )

  el.appendChild( text )

  return el
}

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

const getTextValue = el => {
  if( el.firstChild && el.firstChild.nodeType === 3 )
    return el.firstChild.nodeValue

  return ''
}

const from = {
  'm-string': el => getTextValue( el ),
  'm-number': el => {
    const value = parseFloat( getTextValue( el ) )

    if( Number.isNaN( value ) ) return null

    return value
  },
  'm-boolean': el => getTextValue( el ) === 'true',
  'm-null': el => null,
  'm-array': ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( arr, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) )
      arr.push( value )

    return arr
  }, [] ),
  'm-object': ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( obj, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) ){
      const propertyName = el.getAttribute( 'name' )
      obj[ propertyName ] = value
    }

    return obj
  }, {})
}

module.exports = { from, to }
