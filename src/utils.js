"use strict";

const uniq = require('lodash.uniq')
    , toPairs = require('lodash.topairs')
    , fromPairs = require('lodash.frompairs')
    , flatten = require('lodash.flatten')
    , mergeWith = require('lodash.mergewith')
    , mapValues = require('lodash.mapvalues')
    , elasticlunr = require('elasticlunr')

// scoring: [{ref: 'foo', score: 0.7}, {ref: 'bar', score: 1.1}]
// scores: {foo: 0.7, bar: 1.1}
const scoringToScores = choices => scoring => fromPairs(scoring
  .filter(({ref}) => choices.indexOf(ref) >= 0)
  .map(({ref, score}) => [ref, score])
)

const scoresToRanks = scores => fromPairs(toPairs(scores)
  .sort((a, b) => b[1] - a[1])
  .reduce((ranks, [ref, score], i, scoring) => {
    ranks.push([ref,
      i === 0
        ? 0
        : score < scoring[i - 1][1]
          ? i
          : ranks[i - 1][1]
    ])
    return ranks
  }, [])
)

const applyWeight = (o, weight) => mapValues(o, score => score * weight)

const weightedMeanRanks = (scores, weights) => mergeWith(
  {},
  ...scores.map((s, i) => applyWeight(scoresToRanks(s), weights[i])),
  (dest, src) => dest === undefined
    ? src
    : src === undefined
      ? dest
      : src + dest
)

const normalize = weights => {
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map(w => w / sum)
}

const pairwisePreferences = (scorings, weights, choices) => {
  if (weights && weights.length !== scorings.length) {
    throw new Error(`${scorings.length} scorings but ${weights.length} weights`)
  }

  const _choices = choices
    ? choices
    : uniq(flatten(scorings).map(({ref}) => ref)).sort()

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
    , weightedMeanRanks(_scores, normalize(_weights))
    ]
  )
}

const stopwords = words => {
  const words_has = fromPairs(words.map(x => [x, true]))
      , filter = token => words_has[token] ? undefined : token
      , filterName = words.join('|')
  delete elasticlunr.Pipeline.registeredFunctions[filterName]
  elasticlunr.Pipeline.registerFunction(filter, filterName)
  return filter
}

module.exports = { pairwisePreferences, stopwords, scoresToRanks }
