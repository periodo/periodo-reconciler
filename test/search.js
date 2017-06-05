"use strict";

const test = require('tape')
    , search = require('../src/search')

test('must match on all properties specified', t => {
  t.plan(1)
  t.same(
    search(
      { query: 'Bronze Age'
      , properties:
        [ { p: 'location', v: 'Neverevereverland' }
        , { p: 'start', v: '-2300' }
        , { p: 'stop', v: '-1700' }
        ]
      }
    ),
    []
  )
})

test('can limit results', t => {
  t.plan(1)
  t.same(
    search({ query: 'Akkadian', limit: 1 }),
    [ { id: 'http://n2t.net/ark:/99152/p083p5rr7tg'
      , match: false
      , name: 'Akkadian [Mesopotamia, -2349 to -2149]'
      , score: 6
      , type: [ { id: 'http://www.w3.org/2004/02/skos/core#Concept'
                , name: 'Period definition' } ]
      }
    ]
  )
})
