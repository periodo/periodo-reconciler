"use strict";

const R = require('ramda')
    , label = require('./label')
    , spatial = require('./spatial')
    , temporal = require('./temporal')
    , schulze = require('./schulze')
    , format = require('./format')
    , { DEFAULT_TYPE, WEIGHTS } = require('./consts')

const parseProperties = properties => properties
  ? R.fromPairs(properties.map(({p, pid, v}) => [p || pid, v]))
  : {}

module.exports = {
  against: periods => {

    const _periods = R.values(periods)
        , labelIndex = label.index(_periods)
        , spatialIndex = spatial.index(_periods)
        , temporalIndex = temporal.index(_periods)

    return {
      search: ({ query, properties, limit }) => {

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

        const refs = results.map(results => results.map(({ref}) => ref))
        const choices = R.reduce(
          R.intersection, R.head(refs), R.tail(refs)
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
    }
  }
}
