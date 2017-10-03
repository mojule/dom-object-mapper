'use strict'

const htmls = {
  empty: ``,
  whitespace: `  <string>foo</string> \n  `,
  simple: `<string>foo</string>`,
  fragment: `<string>foo</string><number>1</number>`,
  malformedArray: `<array>1</array>`,
  malformedObject: `<object>1<string>foo</string><string>bar</string></object>`,
  malformedNumberArray: `<number></number><number>foo</number>`,
  insignificantWhitespace: `<object>
    <string name="foo">bar</string>
    <boolean name="baz">true</boolean>
    <array name="qux">
      <number>1</number>
      <number>2</number>
      <number>3</number>
    </array>
  </object>`
}

const expects = {
  empty: [],
  whitespace: [ 'foo' ],
  simple: 'foo',
  fragment: [ 'foo', 1 ],
  malformedArray: [],
  malformedObject: { null: 'bar' },
  malformedNumberArray: [ null, null ],
  insignificantWhitespace: {
    foo: 'bar',
    baz: true,
    qux: [ 1, 2, 3 ]
  }
}

module.exports = { htmls, expects }
