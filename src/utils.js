'use strict'

const getTextValue = el => {
  if( el.firstChild && el.firstChild.nodeType === 3 )
    return el.firstChild.nodeValue

  return ''
}

const primitive = ( type, value, document ) => {
  const el = document.createElement( type )
  const text = document.createTextNode( value )

  el.appendChild( text )

  return el
}

module.exports = { getTextValue, primitive }
