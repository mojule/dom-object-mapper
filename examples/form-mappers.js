'use strict'

const is = require( '@mojule/is' )

const createInput = ( value, document ) => {
  const el = document.createElement( 'input' )

  el.value = value

  return el
}

const createTypedInput = ( type, value, document ) => {
  const el = createInput( value, document )

  el.setAttribute( 'type', type )

  return el
}

const to = {
  string: ( value, document ) => {
    const el = createTypedInput( 'text', value, document )

    el.setAttribute( 'data-type', 'string' )

    return el
  },
  number: ( value, document ) => {
    const el = createTypedInput( 'number', value, document )

    el.setAttribute( 'data-type', 'number' )
    el.setAttribute( 'step', 'any' )

    return el
  },
  boolean: ( value, document ) => {
    const el = document.createElement( 'input' )

    el.setAttribute( 'data-type', 'boolean' )
    el.setAttribute( 'type', 'checkbox' )

    el.checked = value

    return el
  },
  null: ( value, document ) => {
    const el = createTypedInput( 'hidden', value, document )

    el.setAttribute( 'data-type', null )

    return el
  },
  array: ( value, document, toElement ) => {
    const el = document.createElement( 'ol' )

    el.setAttribute( 'data-type', 'array' )

    value.forEach( current => {
      const li = document.createElement( 'li' )
      const valueChild = toElement( current, null, document )

      li.appendChild( valueChild )
      li.setAttribute( 'data-child-type', valueChild.getAttribute( 'data-type' ) )

      el.appendChild( li )
    })

    return el
  },
  object: ( value, document, toElement ) => {
    const el = document.createElement( 'ul' )

    el.setAttribute( 'data-type', 'object' )

    Object.keys( value ).forEach( propertyName =>{
      const li = document.createElement( 'li' )
      const label = document.createElement( 'label' )
      const labelTextWrapper = document.createElement( 'span' )
      const labelText = document.createTextNode( propertyName )
      const valueChild = toElement( value[ propertyName ], '', document )

      valueChild.setAttribute( 'data-property', propertyName )
      li.setAttribute( 'name', propertyName )
      li.setAttribute( 'data-child-type', valueChild.getAttribute( 'data-type' ) )

      labelTextWrapper.appendChild( labelText )
      label.appendChild( labelTextWrapper )
      label.appendChild( valueChild )
      li.appendChild( label )
      el.appendChild( li )
    })

    return el
  }
}

const from = {
  input: el => {
    const type = el.getAttribute( 'type' )

    if( type === 'checkbox' )
      return el.checked

    let value = el.value

    if( type === 'text' )
      return value

    if( type === 'number' ){
      value = parseFloat( value )

      if( Number.isNaN( value ) ) return null

      return value
    }

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
