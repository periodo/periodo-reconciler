"use strict";

const test = require('tape')
    , { pairwisePreferences } = require('../src/utils')

const orderingsToScorings = orderings => orderings.map(
  ordering => ordering.map((ref, i) => ({ref, score: ordering.length - i})))

test('weights default to 1', t => {
  const [choices, matrix] = pairwisePreferences(
    [ [{ref: 'a', score: 2}, {ref: 'b', score: 1}]
    , [{ref: 'b', score: 2}, {ref: 'a', score: 1}]
    ]
  )
  t.plan(2)
  t.same(choices, ['a', 'b'])
  t.same(matrix,
    // a  b
    [ [0, 1] // a
    , [1, 0] // b
    ]
  )
})

test('# of weights must match # of scorings', t => {
  t.plan(1)
  t.throws(() => pairwisePreferences(
    [ [{ref: 'a', score: 2}, {ref: 'b', score: 1}] ], // one scoring
    [1, 2] // two weights
  ), Error)
})

// https://en.wikipedia.org/w/index.php?title=Schulze_method&oldid=783347638
test('wikipedia example', t => {
  const [choices, matrix] = pairwisePreferences(orderingsToScorings(
    [ ['a', 'c', 'b', 'e', 'd'] // voter 1
    , ['a', 'd', 'e', 'c', 'b'] // voter 2
    , ['b', 'e', 'd', 'a', 'c'] // voter 3
    , ['c', 'a', 'b', 'e', 'd'] // voter 4
    , ['c', 'a', 'e', 'b', 'd'] // voter 5
    , ['c', 'b', 'a', 'd', 'e'] // voter 6
    , ['d', 'c', 'e', 'b', 'a'] // voter 7
    , ['e', 'b', 'a', 'd', 'c'] // voter 8
    ]),
    [5, 5, 8, 3, 7, 2, 7, 8] // 1 weight per voter
  )
  t.plan(2)
  t.same(choices, ['a', 'b', 'c', 'd', 'e'])
  t.same(matrix,
    //  a   b   c   d   e
    [ [ 0, 20, 26, 30, 22] // a   20 prefer a to b
    , [25,  0, 16, 33, 18] // b   25 prefer b to a
    , [19, 29,  0, 17, 24] // c
    , [15, 12, 28,  0, 14] // d
    , [23, 27, 21, 31,  0] // e
    ]
  )
})

test('tennessee example', t => {
  const [choices, matrix] = pairwisePreferences(orderingsToScorings(
    [ ['Memphis', 'Nashville', 'Chattanooga', 'Knoxville']
    , ['Nashville', 'Chattanooga', 'Knoxville', 'Memphis']
    , ['Chattanooga', 'Knoxville', 'Nashville', 'Memphis']
    , ['Knoxville', 'Chattanooga', 'Nashville', 'Memphis']
    ]),
    [42, 26, 15, 17]
  )
  t.plan(2)
  t.same(choices, ['Chattanooga', 'Knoxville', 'Memphis', 'Nashville'])
  t.same(matrix,
    // Ch  Kn  Me  Na
    [ [ 0, 83, 58, 32] // Ch   83 prefer Ch to Kn
    , [17,  0, 58, 32] // Kn   17 prefer Kn to Ch
    , [42, 42,  0, 42] // Me
    , [68, 68, 58,  0] // Na
    ]
  )
})

test('can limit choices', t => {
  const [choices, matrix] = pairwisePreferences(orderingsToScorings(
    [ ['Memphis', 'Nashville', 'Chattanooga', 'Knoxville']
    , ['Nashville', 'Chattanooga', 'Knoxville', 'Memphis']
    , ['Chattanooga', 'Knoxville', 'Nashville', 'Memphis']
    , ['Knoxville', 'Chattanooga', 'Nashville', 'Memphis']
    ]),
    [42, 26, 15, 17],
    ['Memphis', 'Nashville']
  )
  t.plan(2)
  t.same(choices, ['Memphis', 'Nashville'])
  t.same(matrix,
    // Me  Na
    [ [ 0, 42] // Me
    , [58,  0] // Na
    ]
  )
})
