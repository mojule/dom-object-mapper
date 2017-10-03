'use strict'

const ToDom = options => {
  const { is, document, mappers } = options
  const { to } = mappers

  const toElement = ( value, propertyName ) => {
    const type = is.of( value )
    const element = to[ type ]( value, document, toElement )

    if( propertyName )
      element.setAttribute( 'name', propertyName )

    return element
  }

  const toDom = value => toElement( value, null )

  return toDom
}

module.exports = ToDom
