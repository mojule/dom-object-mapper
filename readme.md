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

## wtf, why would I want this

It's useful to treat JSON values as object graphs that can be queried and
traversed and may as well use DOM as the intermediate format because it has lots
of tooling and built in functionality - it's a simple and lazy solution

## notes on mapping to the DOM

By default it only works with JSON data types, but see the tests for examples of
using custom types, as well as using namespaced custom element names

Will currently crash and burn on circular references

## notes on mapping from the DOM

We will probably add a strict mode at some point, but for now the following
rules apply:

When mapping `<string>`, `<number>` and `<boolean>` nodes, it is expected that
they contain a single text node - this will become the string, or be passed to
`parseFloat`, or converted to boolean via `=== 'true'`. If the value returned
from `parseFloat` is `NaN` it will be converted to `null` to retain JSON
compatibility. The text node's value is not trimmed.

All child nodes of an `<object>` element are expected to have a `name` attribute

Unexpected nodes are generally ignored but only minimal testing has been done
to verify this - at the very least insignificant whitespace can be used for
formatting purposes, although remember it is significant in `<string>`,
`<number>` and `<boolean>` as mentioned above

A document fragment will be converted to an array - this does however mean that
a single tag surrounded by whitespace will end up being a single value in an
array, so be careful of that

## options

The options argument to `Mapper` must be at least `{ document }`. Other options
you can pass are `{ mappers: { to, from } }` and `{ is }` - see the tests,
fixtures etc for examples of using these options - a PR for documentation on
these would be very welcome.
