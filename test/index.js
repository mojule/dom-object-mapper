'use strict'

const assert = require( 'assert' )

const domUtils = require( '@mojule/dom-utils' )
const Mapper = require( '../' )
const document = require( './fixtures/document' )
const valueToDomFixtures = require( './fixtures/value-to-dom' )
const domToValueFixtures = require( './fixtures/dom-to-value' )
const namespacedMappers = require( './fixtures/namespaced-mappers' )
const customTypes = require( './fixtures/custom-types' )

const { stringify, parse } = domUtils

const mapper = Mapper( { document } )

const { toDom, fromDom } = mapper

describe( 'dom-object-mapper', () => {
  describe( 'value to dom', () => {
    const { values, expects } = valueToDomFixtures

    Object.keys( values ).forEach( name => {
      const value = values[ name ]

      it( `${ name } fixture matches expected HTML string`, () => {
        const expect = expects[ name ]

        const dom = toDom( value )
        const html = stringify( dom )

        assert.strictEqual( html, expect )
      })

      it( `${ name } fixture round trips to original value`, () => {
        const dom = toDom( value )
        const rounded = fromDom( dom )

        assert.deepEqual( value, rounded )
      })
    })
  })

  it( 'throws on circular references', () => {
    const a = {}
    const b = { a }

    a.b = b

    assert.throws( () => toDom( a ) )
  })

  describe( 'dom to value', () => {
    const { htmls, expects } = domToValueFixtures

    Object.keys( htmls ).forEach( name => {
      const html = htmls[ name ]
      const dom = parse( document, html )

      it( `${ name } fixture matches expected value`, () => {
        const expect = expects[ name ]
        const value = fromDom( dom )

        assert.deepEqual( value, expect )
      })
    })
  })

  describe( 'options', () => {
    describe( 'custom mappers', () => {
      describe( 'namespaced elements', () => {
        const mapper = Mapper({ document, mappers: namespacedMappers })

        const { toDom, fromDom } = mapper
        const { values, expects } = valueToDomFixtures

        Object.keys( values ).forEach( name => {
          const value = values[ name ]

          it( `${ name } fixture round trips to original value`, () => {
            const dom = toDom( value )
            const rounded = fromDom( dom )

            assert.deepEqual( value, rounded )
          })
        })
      })
    })

    describe( 'custom types', () => {
      const options = Object.assign( {}, customTypes, { document } )
      const mapper = Mapper( options )

      const { toDom, fromDom } = mapper

      it( 'custom date type', () => {
        const value = new Date( '1980-10-09' )
        const expect = '<date>1980-10-09T00:00:00.000Z</date>'

        const dom = toDom( value )
        const html = stringify( dom )

        assert.strictEqual( html, expect )
      })

      it( 'custom buffer type', () => {
        const value = new Buffer( [ 1, 2, 3 ] )
        const expect = '<buffer>AQID</buffer>'

        const dom = toDom( value )
        const html = stringify( dom )

        assert.strictEqual( html, expect )
      })
    })
  })

  describe( 'errors', () => {
    it( 'throws with no document option', () => {
      assert.throws( () => Mapper() )
    })
  })
})
