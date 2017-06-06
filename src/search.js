"use strict";

const fromPairs = require('lodash.frompairs')
    , values = require('lodash.values')
    , intersection = require('lodash.intersection')
    , label = require('./label')
    , spatial = require('./spatial')
    , temporal = require('./temporal')
    , schulze = require('./schulze')
    , format = require('./format')
    , { periods } = require('./data')
    , { DEFAULT_TYPE, WEIGHTS } = require('./consts')


const parseProperties = properties => properties
  ? fromPairs(properties.map(({p, pid, v}) => [p || pid, v]))
  : {}

const _periods = values(periods)

const labelIndex = label.index(_periods)
    , spatialIndex = spatial.index(_periods)
    , temporalIndex = temporal.index(_periods)

module.exports = function search({ query, properties, limit }) {

  const results = [ labelIndex.search(query) ]
      , weights = [ WEIGHTS.label ]

  const { location, start, stop } = parseProperties(properties)

  if (location) {
    results.push(spatialIndex.search(location))
    weights.push(WEIGHTS.spatial)
  }

  if (start) {
    results.push(temporalIndex.search(start, stop))
    weights.push(WEIGHTS.temporal)
  }

  const choices = intersection(
    ...results.map(results => results.map(({ref}) => ref))
  ).sort()

  const ranking = schulze(results, weights, choices)

  return ranking.slice(0, limit)
    .map(({ref, score}) => (
        { id: ref
        , name: format(periods[ref])
        , type: [DEFAULT_TYPE]
        , score
        , match: ranking.length === 1
        }
      )
    )
}
