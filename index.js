'use strict'

const FromDom = require( './src/from-dom' )
const ToDom = require( './src/to-dom' )
const defaultOptions = require( './src/options' )

const Mapper = options => {
  options = Object.assign( {}, defaultOptions, options )

  if( !options.document )
    throw Error( 'A document instance is required at options.document' )

  const toDom = ToDom( options )
  const fromDom = FromDom( options )

  return { toDom, fromDom }
}

module.exports = Mapper
