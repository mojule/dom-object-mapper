'use strict'

const kitchenSink = require( './kitchen-sink' )
const formMappers = require( './form-mappers' )
const Mapper = require( '..' )

const mapper = Mapper( { mappers: formMappers, document } )

const { fromDom, toDom } = mapper

document.addEventListener( 'DOMContentLoaded', e => {
  const form = document.querySelector( 'form' )
  const pre = document.querySelector( 'pre' )

  const kitchenInputs = toDom( kitchenSink )

  form.appendChild( kitchenInputs )

  const populatePre = () => {
    const value = fromDom( kitchenInputs )
    pre.innerText = JSON.stringify( value, null, 2 )
  }

  const inputs = form.querySelectorAll( 'input' )

  Array.from( inputs ).forEach( input => {
    input.addEventListener( 'change', populatePre )
  })

  populatePre()
})
