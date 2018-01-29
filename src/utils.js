"use strict";

const R = require('ramda')
    , { readFileSync } = require('fs')

// scoring: [{ref: 'foo', score: 0.7}, {ref: 'bar', score: 1.1}]
// scores: {foo: 0.7, bar: 1.1}
const scoringToScores = choices => scoring => R.fromPairs(scoring
  .filter(({ref}) => choices.indexOf(ref) >= 0)
  .map(({ref, score}) => [ref, score])
)

const pairwisePreferences = (scorings, weights, choices) => {
  if (weights && weights.length !== scorings.length) {
    throw new Error(`${scorings.length} scorings but ${weights.length} weights`)
  }

  const _choices = choices
    ? choices
    : R.uniq(R.flatten(scorings).map(({ref}) => ref)).sort()

  const _scores = scorings.map(scoringToScores(_choices))

  const _weights = weights === undefined
    ? Array(scorings.length).fill(1) : weights

  const countPreferences = (x, y) => _scores.reduce(
    (count, scores, i) => (
      (scores[x] || 0) > (scores[y] || 0) ? count + _weights[i] : count
    ), 0)

  return (
    [ _choices
    , _choices.map(x => _choices.map(y => countPreferences(x, y)))
    ]
  )
}

const loadJSON = path => JSON.parse(readFileSync(path, 'utf8'))

module.exports = {
  pairwisePreferences,
  loadJSON
}
