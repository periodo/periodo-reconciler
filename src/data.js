const forEach = require('lodash.foreach')
    , dataset = require('../p0d.json')
    , periods = {}
    , sources = {}


forEach(dataset.periodCollections, authority => {
  sources[authority.id] = authority.source;
  authority.source.numDefinitions = Object.keys(authority.definitions).length

  forEach(authority.definitions, period => {
    period.sourceID = authority.id;
    periods[period.id] = period;
  })
})

module.exports = { periods, sources }
