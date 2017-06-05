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

const refs = results => results.map(({ref}) => ref)

module.exports = function search({ query, properties, limit }) {
  const { location, start, stop } = parseProperties(properties)

  const labelResults = labelIndex.search(query)
      , spatialResults = spatialIndex.search(location)
      , temporalResults = temporalIndex.search(start, stop)

  const choices = intersection(
    ...[ labelResults, spatialResults, temporalResults ]
      .filter(results => results.length > 0)
      .map(refs)
  ).sort()

  const ranking = schulze(
    [ labelResults, spatialResults, temporalResults ],
    [ WEIGHTS.label, WEIGHTS.spatial, WEIGHTS.temporal ],
    choices
  )

  return ranking.slice(0, limit)
    .map((ref, index) => (
        { id: ref
        , name: format(periods[ref])
        , type: [DEFAULT_TYPE]
        , score: ranking.length - index
        , match: ranking.length === 1
        }
      )
    )
}
