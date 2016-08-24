"use strict";

const lunr = require('lunr')
    , forEach = require('lodash.foreach')
    , tokenize = require('./tokenize')
    , { PERIOD_TYPE } = require('./consts')
    , { periods } = require('./data')


const index = lunr(function () {
  this.field('originalLabel', { boost: 10 });
  this.field('label', { boost: 12 });

  this.field('phase', { boost: 4 });

  this.field('suffix', { boost: 1 });
  this.field('numbering', { boost: 1 });
})

forEach(periods, period => {
  index.add(Object.assign({
    id: period.id,
  }, tokenize(period.label)))
});

function formatName(period) {
  const { label, spatialCoverageDescription } = period

  let formatted = label

  if (spatialCoverageDescription) {
    formatted += ` [${spatialCoverageDescription}]`
  }

  return formatted
}

module.exports = function search({ query, limit }) {
  const results = index.search(query).slice(0, limit)

  return results.map(({ ref, score }) => {
    const period = periods[ref]

    return {
      score,
      id: period.id,
      name: formatName(period),
      type: [PERIOD_TYPE],
      match: false,
    }
  })
}
