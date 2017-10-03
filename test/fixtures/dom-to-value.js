'use strict'

const htmls = {
  empty: ``,
  whitespace: `  <string>foo</string> \n  `,
  simple: `<string>foo</string>`,
  fragment: `<string>foo</string><number>1</number>`,
  malformedArray: `<array>1</array>`,
  malformedObject: `<object>1<string>foo</string><string>bar</string></object>`,
  malformedNumberArray: `<number></number><number>foo</number>`
}

const expects = {
  empty: [],
  whitespace: [ 'foo' ],
  simple: 'foo',
  fragment: [ 'foo', 1 ],
  malformedArray: [],
  malformedObject: { null: 'bar' },
  malformedNumberArray: [ null, null ]
}

module.exports = { htmls, expects }
