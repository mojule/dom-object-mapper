'use strict'

const is = require( '@mojule/is' )
const utils = require( '../../src/utils' )

const { primitive, getTextValue } = utils

const typedPrimitive = ( type, value, document ) => {
  const el = primitive( 'span', value, document )

  el.setAttribute( 'data-type', type )
  el.setAttribute( 'data-value', value )

  return el
}

const to = {
  string: ( value, document ) => typedPrimitive( 'string', value, document ),
  number: ( value, document ) => typedPrimitive( 'number', value, document ),
  boolean: ( value, document ) => typedPrimitive( 'boolean', value, document ),
  null: ( value, document ) => typedPrimitive( 'null', '', document ),
  array: ( value, document, toElement ) => {
    const el = document.createElement( 'ol' )

    el.setAttribute( 'data-type', 'array' )

    value.forEach( current => {
      const li = document.createElement( 'li' )

      li.appendChild( toElement( current, null, document ) )

      el.appendChild( li )
    })

    return el
  },
  object: ( value, document, toElement ) => {
    const el = document.createElement( 'ul' )

    el.setAttribute( 'data-type', 'object' )

    Object.keys( value ).forEach( propertyName =>{
      const li = document.createElement( 'li' )
      const valueChild = toElement( value[ propertyName ], '', document )

      valueChild.setAttribute( 'data-property', propertyName )

      li.setAttribute( 'name', propertyName )
      li.appendChild( valueChild )

      el.appendChild( li )
    })

    return el
  }
}

const from = {
  span: el => {
    const type = el.getAttribute( 'data-type' )

    let value = getTextValue( el )

    if( type === 'string' )
      return value

    if( type === 'number' ){
      value = parseFloat( value )

      if( Number.isNaN( value ) ) return null

      return value
    }

    if( type === 'boolean' )
      return value === 'true'

    return null
  },
  ol: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( arr, li ) => {
    const firstValueChild = li.querySelector( '[data-type]' )
    const value = fromDom( firstValueChild )

    if( !is.undefined( value ) )
      arr.push( value )

    return arr
  }, [] ),
  ul: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( obj, li ) => {
    const firstValueChild = li.querySelector( '[data-type]' )
    const value = fromDom( firstValueChild )

    if( !is.undefined( value ) ){
      const propertyName = li.getAttribute( 'name' )
      obj[ propertyName ] = value
    }

    return obj
  }, {})
}

module.exports = { from, to }
