'use strict'

const values = {
  string: 'foo',
  emptyString: '',
  number: -1.5,
  true: true,
  false: false,
  null: null,
  array: [ 1, 2, 3 ],
  emptyArray: [],
  object: { foo: 'bar', baz: 'qux' },
  emptyObject: {},
  kitchenSink: {
    string: 'foo',
    emptyString: '',
    number: -1.5,
    true: true,
    false: false,
    null: null,
    array: [ 1, 2, 3 ],
    emptyArray: [],
    object: { foo: 'bar', baz: 'qux' },
    emptyObject: {}
  }
}

const expects = {
  string: '<string>foo</string>',
  emptyString: '<string></string>',
  number: '<number>-1.5</number>',
  true: '<boolean>true</boolean>',
  false: '<boolean>false</boolean>',
  null: '<null></null>',
  array: '<array><number>1</number><number>2</number><number>3</number></array>',
  emptyArray: '<array></array>',
  object: '<object><string name="foo">bar</string><string name="baz">qux</string></object>',
  emptyObject: '<object></object>',
  kitchenSink: '<object><string name="string">foo</string><string name="emptyString"></string><number name="number">-1.5</number><boolean name="true">true</boolean><boolean name="false">false</boolean><null name="null"></null><array name="array"><number>1</number><number>2</number><number>3</number></array><array name="emptyArray"></array><object name="object"><string name="foo">bar</string><string name="baz">qux</string></object><object name="emptyObject"></object></object>'
}

module.exports = { values, expects }
