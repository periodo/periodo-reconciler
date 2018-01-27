const R = require('ramda')
    , { loadJSON } = require('./utils')


const extractLocalizedLabels = definition => {
  const localizedLabels = [].concat(...R.values(definition.localizedLabels))
    .filter(label => label != definition.label)
    .join(', ')
  return localizedLabels.length > 0 ? localizedLabels : undefined
}

const extractSpatialCoverage = definition => {
  const spatialCoverage = [].concat(...R.values(definition.spatialCoverage))
    .map(place => place.label)
    .join(', ')
  return spatialCoverage.length > 0 ? spatialCoverage : undefined
}

const extractPeriod = (base, definition) => R.mergeAll([
  definition,
  {id: base + definition.id},
  {localizedLabels: extractLocalizedLabels(definition)},
  {spatialCoverage: extractSpatialCoverage(definition)}
])

const extractDefinitions = collection => R.map(
  R.assoc('sourceID', collection.id),
  R.values(collection.definitions)
)

const load = path => {
  const dataset = loadJSON(path)
  const authorities = R.values(dataset.periodCollections)

  const sources = R.fromPairs(
    R.map(
      collection => [
        collection.id,
        R.assoc(
          'numDefinitions',
          R.length(R.keys(collection.definitions)),
          collection.source
        )
      ],
      authorities
    )
  )

  const periods = R.indexBy(
    R.prop('id'),
    R.map(
      definition => extractPeriod(dataset['@context']['@base'], definition),
      R.chain(extractDefinitions, authorities)
    )
  )

  return {sources, periods}
}

module.exports = { load }
