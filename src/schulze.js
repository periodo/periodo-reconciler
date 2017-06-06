"use strict";

const FW = require('floyd-warshall')
    , invert = require('lodash.invert')
    , { pairwisePreferences } = require('./utils')

module.exports = (scorings, weights, choices) => {
  const [_choices, matrix, scores] = pairwisePreferences(
    scorings, weights, choices)
  const indices = invert(_choices)
  const widestPaths = new FW(matrix).widestPaths
  return Array
    .from(_choices)
    .sort((a, b) =>
      widestPaths[indices[b]][indices[a]] -
      widestPaths[indices[a]][indices[b]]
    )
    .map(ref => ({ref, score: scores[ref]}))
}
