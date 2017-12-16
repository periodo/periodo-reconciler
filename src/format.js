"use strict";

const formatStart = start => start.in
  ? (start.in.year || start.in.earliestYear)
  : 'unknown'

const formatStop = stop => stop.in
  ? (stop.in.year || stop.in.latestYear || '')
  : 'unknown'

const formatTemporalRange = period => (
  `${formatStart(period.start)} to ${formatStop(period.stop)}`
)

module.exports = period => {
  const { label, spatialCoverageDescription } = period

  let formatted = label + ' ['

  if (spatialCoverageDescription) {
    formatted += `${spatialCoverageDescription}, `
  }

  formatted += `${formatTemporalRange(period)}]`

  return formatted
}
