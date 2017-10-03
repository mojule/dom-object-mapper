'use strict'

const FromDom = options => {
  const { mappers } = options
  const { from } = mappers

  const fromDom = el => {
    if( el.nodeType === 11 )
      return from.array( el, fromDom )

    const type = el.localName

    if( from[ type ] )
      return from[ type ]( el, fromDom )
  }

  return fromDom
}

module.exports = FromDom
