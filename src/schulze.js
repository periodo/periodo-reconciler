"use strict";

const R = require('ramda')
    , FW = require('floyd-warshall')
    , { pairwisePreferences } = require('./utils')

module.exports = (scorings, weights, choices) => {
  const [ _choices, matrix ] = pairwisePreferences(
    scorings, weights, choices)

  const indices = R.invert(_choices)
      , widestPaths = new FW(matrix).widestPaths
      , wins = (a, b) => widestPaths[indices[a]][indices[b]]
      , winDifferential = (a, b) => wins(a, b) - wins(b, a)

  return Array
    .from(_choices)
    .sort((a, b) => winDifferential(b, a))
    .reduce((results, ref, i) => {
      results.push(
        { ref
        , score: i === 0
            ? 0
            : results[i - 1].score + winDifferential(results[i - 1].ref, ref)
        }
      )
      return results
    }, [])
}
