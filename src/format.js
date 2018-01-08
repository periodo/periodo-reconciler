"use strict";

const formatStart = start => start.in
  ? (start.in.year || start.in.earliestYear)
  : 'unknown'

const formatStop = stop => stop.in
  ? (stop.in.year || stop.in.latestYear || '')
  : 'unknown'

const formatSpatialCoverage = period => {
  const {spatialCoverage, spatialCoverageDescription} = period
  const parts = []
  if (spatialCoverageDescription) {
    parts.push(spatialCoverageDescription)
  }
  if (spatialCoverage) {
    parts.push(spatialCoverage)
  }
  return parts.join(', ')
}

const formatTemporalRange = period => (
  `${formatStart(period.start)} to ${formatStop(period.stop)}`
)

module.exports = p => (
  `${p.label} [${formatSpatialCoverage(p)}: ${formatTemporalRange(p)}]`
)
