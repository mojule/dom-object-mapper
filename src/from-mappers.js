'use strict'

const is = require( '@mojule/is' )

const getTextValue = el => {
  if( el.firstChild && el.firstChild.nodeType === 3 )
    return el.firstChild.nodeValue

  return ''
}

const mappers = {
  string: el => getTextValue( el ),
  number: el => {
    const value = parseFloat( getTextValue( el ) )

    if( Number.isNaN( value ) ) return null

    return value
  },
  boolean: el => getTextValue( el ) === 'true',
  null: el => null,
  array: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( arr, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) )
      arr.push( value )

    return arr
  }, [] ),
  object: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( obj, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) ){
      const propertyName = el.getAttribute( 'name' )
      obj[ propertyName ] = value
    }

    return obj
  }, {})
}

module.exports = mappers
