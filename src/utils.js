"use strict";

const uniq = require('lodash.uniq')
    , fromPairs = require('lodash.frompairs')
    , flatten = require('lodash.flatten')

// assumes no duplicate refs
const scoringToObject = scoring => fromPairs(
  scoring.map(({ref, score}) => [ref, score]))

const pairwisePreferences = (scorings, weights, choices) => {
  if (weights && weights.length !== scorings.length) {
    throw new Error(`${scorings.length} scorings but ${weights.length} weights`)
  }

  const _choices = choices
    ? choices
    : uniq(flatten(scorings).map(({ref}) => ref)).sort()

  const _scorings = scorings.map(scoringToObject)

  const _weights = weights === undefined
    ? Array(scorings.length).fill(1) : weights

  const countPreferences = (x, y) => _scorings.reduce(
    (count, scores, i) => (
      (scores[x] || 0) > (scores[y] || 0) ? count + _weights[i] : count
    ), 0)

  return (
    [ _choices
    , _choices.map(x => _choices.map(y => countPreferences(x, y)))
    ]
  )
}

module.exports = { pairwisePreferences }
