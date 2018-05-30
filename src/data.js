const R = require('ramda')
    , { loadJSON } = require('./utils')


const extractLocalizedLabels = period => {
  const localizedLabels = [].concat(...R.values(period.localizedLabels))
    .filter(label => label != period.label)
    .join(', ')
  return localizedLabels.length > 0 ? localizedLabels : undefined
}

const extractSpatialCoverage = period => {
  const spatialCoverage = [].concat(...R.values(period.spatialCoverage))
    .map(place => place.label)
    .join(', ')
  return spatialCoverage.length > 0 ? spatialCoverage : undefined
}

const extractPeriod = (base, period) => R.mergeAll([
  period,
  {id: base + period.id},
  {localizedLabels: extractLocalizedLabels(period)},
  {spatialCoverage: extractSpatialCoverage(period)}
])

const extractPeriods = authority => R.map(
  R.assoc('sourceID', authority.id),
  R.values(authority.periods)
)

const load = path => {
  const dataset = loadJSON(path)
  const authorities = R.values(dataset.authorities)

  const sources = R.fromPairs(
    R.map(
      authority => [
        authority.id,
        R.assoc(
          'numPeriods',
          R.length(R.keys(authority.periods)),
          authority.source
        )
      ],
      authorities
    )
  )

  const periods = R.indexBy(
    R.prop('id'),
    R.map(
      period => extractPeriod(dataset['@context']['@base'], period),
      R.chain(extractPeriods, authorities)
    )
  )

  return {sources, periods}
}

module.exports = { load }
