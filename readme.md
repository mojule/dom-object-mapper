# dom-object-mapper

Maps values to DOM nodes and back again

`npm install @mojule/dom-object-mapper`

```javascript
const Mapper = require( '@mojule/dom-object-mapper' )

// could be window.document from the browser, or a jsdom document instance
const mapper = Mapper( { document } )

const value = {
  foo: 'bar',
  baz: true,
  qux: [ 1, 2, 3 ]
}

const { toDom, fromDom } = mapper

/*
  <object>
    <string name="foo">bar</string>
    <boolean name="baz">true</boolean>
    <array name="qux">
      <number>1</number>
      <number>2</number>
      <number>3</number>
    </array>
  </object>
*/
const dom = toDom( value )

/*
  {
    foo: 'bar',
    baz: true,
    qux: [ 1, 2, 3 ]
  }
*/
const obj = fromDom( dom )
```

By default it only works with JSON data types, but see the tests for examples of
using custom types, as well as using namespaced custom element names
