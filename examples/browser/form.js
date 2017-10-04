(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"@mojule/is":7}],2:[function(require,module,exports){
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

},{"..":4,"./form-mappers":1,"./kitchen-sink":3}],3:[function(require,module,exports){
'use strict'

/*
const kitchenSink = {
  name: 'foo',
  age: 42,
  good: true,
  bad: false,
  null: null,
  counts: [ 1, 2, 3 ],
  secondaryCounts: [],
  things: { foo: 'bar', baz: 'qux' },
  otherThings: {}
}
*/
const kitchenSink = {
  "Name": "Akosua",
  "Occupation": "Zombie Hunter",
  "Is Infected": false,
  "Equipment": [
    {
      "Name": "Backpack",
      "Type": "Container",
      "Capacity": 40000,
      "Weight": 2000,
      "Contents": [
        {
          "Name": "Water Bottle",
          "Type": "Container",
          "Capacity": 1000,
          "Weight": 0.2,
          "Contents": [
            {
              "Name": "Water",
              "Weight": 365.9
            }
          ]
        },
        {
          "Name": "Necronomicon",
          "Type": "Book",
          "Weight": 0.87
        }
      ]
    },
    {
      "Name": "Katana",
      "Type": "Weapon",
      "Class": "Edged",
      "Damage": {
        "Base": "4d6",
        "Modifier": -2
      },
      "Weight": 1200
    }
  ]
}

module.exports = kitchenSink

},{}],4:[function(require,module,exports){
'use strict'

const FromDom = require( './src/from-dom' )
const ToDom = require( './src/to-dom' )
const defaultOptions = require( './src/default-options' )

const Mapper = options => {
  options = Object.assign( {}, defaultOptions, options )

  if( !options.document )
    throw Error( 'A document instance is required at options.document' )

  const toDom = ToDom( options )
  const fromDom = FromDom( options )

  return { toDom, fromDom }
}

module.exports = Mapper

},{"./src/default-options":8,"./src/from-dom":9,"./src/to-dom":11}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isEmpty = function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }return true;
};

var predicates = {
  number: function number(subject) {
    return typeof subject === 'number' && isFinite(subject);
  },
  integer: Number.isInteger,
  string: function string(subject) {
    return typeof subject === 'string';
  },
  boolean: function boolean(subject) {
    return typeof subject === 'boolean';
  },
  array: Array.isArray,
  null: function _null(subject) {
    return subject === null;
  },
  undefined: function (_undefined) {
    function undefined(_x) {
      return _undefined.apply(this, arguments);
    }

    undefined.toString = function () {
      return _undefined.toString();
    };

    return undefined;
  }(function (subject) {
    return subject === undefined;
  }),
  function: function _function(subject) {
    return typeof subject === 'function';
  },
  object: function object(subject) {
    return (typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) === 'object' && !predicates.null(subject) && !predicates.array(subject);
  },
  empty: function empty(subject) {
    return predicates.object(subject) && isEmpty(subject);
  }
};

module.exports = predicates;
},{}],6:[function(require,module,exports){
'use strict';

var defaultPredicates = require('./default-predicates');

var Is = function Is() {
  var predicates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPredicates;

  /*
    weird triple assign is so that custom predicate keys come before defaults
    so that user predicates always take precedence over defaults
  */
  if (predicates !== defaultPredicates) predicates = Object.assign({}, predicates, defaultPredicates, predicates);

  var t = T(predicates);

  return t.types().reduce(function (is, name) {
    is[name] = function (value) {
      return t.is(value, name);
    };

    return is;
  }, t);
};

var T = function T(typePredicates) {
  var keys = Object.keys(typePredicates);

  var is = function is(subject, typename) {
    return typePredicates[typename] && typePredicates[typename](subject);
  };

  var isOnly = function isOnly(subject, typename) {
    return is(subject, typename) && allOf(subject).length === 1;
  };

  var some = function some(subject) {
    for (var _len = arguments.length, typenames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      typenames[_key - 1] = arguments[_key];
    }

    return typenames.some(function (typename) {
      return is(subject, typename);
    });
  };

  var every = function every(subject) {
    for (var _len2 = arguments.length, typenames = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      typenames[_key2 - 1] = arguments[_key2];
    }

    return typenames.every(function (typename) {
      return is(subject, typename);
    });
  };

  var of = function of(subject) {
    return keys.find(function (key) {
      return is(subject, key);
    });
  };

  var allOf = function allOf(subject) {
    return keys.filter(function (key) {
      return is(subject, key);
    });
  };

  var types = function types() {
    return keys.slice();
  };

  return { is: is, isOnly: isOnly, some: some, every: every, of: of, allOf: allOf, types: types };
};

Object.assign(Is, Is());

module.exports = Is;
},{"./default-predicates":5}],7:[function(require,module,exports){
'use strict'

module.exports = require( './dist' )

},{"./dist":6}],8:[function(require,module,exports){
'use strict'

const is = require( '@mojule/is' )
const to = require( './to-mappers' )
const from = require( './from-mappers' )

const options = { strict: true, is, mappers: { to, from } }

module.exports = options

},{"./from-mappers":10,"./to-mappers":12,"@mojule/is":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict'

const is = require( '@mojule/is' )
const utils = require( './utils' )

const { getTextValue } = utils

const mappers = {
  string: el => getTextValue( el ),
  number: el => {
    const value = parseFloat( getTextValue( el ) )

    if( Number.isNaN( value ) ) return null

    return value
  },
  boolean: el => getTextValue( el ) === 'true',
  null: el => null,
  array: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( arr, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) )
      arr.push( value )

    return arr
  }, [] ),
  object: ( el, fromDom ) => Array.from( el.childNodes ).reduce( ( obj, el ) => {
    const value = fromDom( el )

    if( !is.undefined( value ) ){
      const propertyName = el.getAttribute( 'name' )
      obj[ propertyName ] = value
    }

    return obj
  }, {})
}

module.exports = mappers

},{"./utils":13,"@mojule/is":7}],11:[function(require,module,exports){
'use strict'

const ToDom = options => {
  const { is, document, mappers } = options
  const { to } = mappers

  const toElement = ( value, propertyName ) => {
    const type = is.of( value )
    const element = to[ type ]( value, document, toElement )

    if( propertyName )
      element.setAttribute( 'name', propertyName )

    return element
  }

  const toDom = value => toElement( value, null )

  return toDom
}

module.exports = ToDom

},{}],12:[function(require,module,exports){
'use strict'

const utils = require( './utils' )

const { primitive } = utils

const mappers = {
  string: ( value, document ) => primitive( 'string', value, document ),
  number: ( value, document ) => primitive( 'number', value, document ),
  boolean: ( value, document ) => primitive( 'boolean', value, document ),
  null: ( value, document ) => document.createElement( 'null' ),
  array: ( value, document, toElement ) => {
    const el = document.createElement( 'array' )

    value.forEach( current =>
      el.appendChild( toElement( current, null, document ) )
    )

    return el
  },
  object: ( value, document, toElement ) => {
    const el = document.createElement( 'object' )

    Object.keys( value ).forEach( propertyName =>
      el.appendChild( toElement( value[ propertyName ], propertyName, document ) )
    )

    return el
  }
}

module.exports = mappers

},{"./utils":13}],13:[function(require,module,exports){
'use strict'

const getTextValue = el => {
  if( el.firstChild && el.firstChild.nodeType === 3 )
    return el.firstChild.nodeValue

  return ''
}

const primitive = ( type, value, document ) => {
  const el = document.createElement( type )
  const text = document.createTextNode( value )

  el.appendChild( text )

  return el
}

module.exports = { getTextValue, primitive }

},{}]},{},[2]);
