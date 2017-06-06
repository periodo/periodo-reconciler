"use strict";

const test = require('tape')
    , schulze = require('../src/schulze')

const orderings2scorings = orderings => orderings.map(
  ordering => ordering.map((ref, i) => ({ref, score: ordering.length - i})))

// https://en.wikipedia.org/w/index.php?title=Schulze_method&oldid=783347638
test('wikipedia example', t => {
  t.plan(1)
  t.same(schulze(orderings2scorings(
    [ ['a', 'c', 'b', 'e', 'd']
    , ['a', 'd', 'e', 'c', 'b']
    , ['b', 'e', 'd', 'a', 'c']
    , ['c', 'a', 'b', 'e', 'd']
    , ['c', 'a', 'e', 'b', 'd']
    , ['c', 'b', 'a', 'd', 'e']
    , ['d', 'c', 'e', 'b', 'a']
    , ['e', 'b', 'a', 'd', 'c']
    ]),
    [5, 5, 8, 3, 7, 2, 7, 8]
  ).map(({ref}) => ref), ['e', 'a', 'c', 'b', 'd'])
})

test('tennessee example', t => {
  t.plan(1)
  t.same(schulze(orderings2scorings(
    [ ['Memphis', 'Nashville', 'Chattanooga', 'Knoxville']
    , ['Nashville', 'Chattanooga', 'Knoxville', 'Memphis']
    , ['Chattanooga', 'Knoxville', 'Nashville', 'Memphis']
    , ['Knoxville', 'Chattanooga', 'Nashville', 'Memphis']
    ]),
    [42, 26, 15, 17]
  ).map(({ref}) => ref), ['Nashville', 'Chattanooga', 'Knoxville', 'Memphis'])
})

test('empty scorings have no effect', t => {
  t.plan(1)
  t.same(schulze(orderings2scorings(
    [ ['Memphis', 'Nashville', 'Chattanooga', 'Knoxville']
    , []
    , []
    ])
  ).map(({ref}) => ref), ['Memphis', 'Nashville', 'Chattanooga', 'Knoxville'])
})
