const forEach = require('lodash.foreach')
    , values = require('lodash.values')
    , { loadJSON } = require('./utils')

const load = path => {
  const dataset = loadJSON(path)
      , sources = {}
      , periods = {}

  forEach(dataset.periodCollections, collection => {
    sources[collection.id] = collection.source
    sources[collection.id].numDefinitions = (
      Object.keys(collection.definitions).length
    )

    forEach(collection.definitions, period => {
      period.id = dataset['@context']['@base'] + period.id
      period.sourceID = collection.id

      const localizedLabels = [].concat(...values(period.localizedLabels))
        .filter(label => label != period.label)
        .join(', ')
      if (localizedLabels.length > 0) {
        period.localizedLabels = localizedLabels
      } else {
        delete period.localizedLabels
      }

      const spatialCoverage = [].concat(...values(period.spatialCoverage))
        .map(place => place.label)
        .join(', ')
      if (spatialCoverage.length > 0) {
        period.spatialCoverage = spatialCoverage
      } else {
        delete period.spatialCoverage
      }

      periods[period.id] = period
    })
  })
  return {sources, periods}
}

module.exports = { load }
