"use strict";

const lunr = require('lunr')
    , { PERIOD_TYPE } = require('./consts')
    , tokenize = require('./tokenize')
    , dataset = require('../p0d.json')
    , periods = {}
    , sources = {}

const forEach = (obj, cb) => {
  Object.keys(obj).forEach(key => {
    cb(obj[key], key);
  })
}

const index = lunr(function () {
  this.field('originalLabel', { boost: 10 });
  this.field('label', { boost: 12 });

  this.field('phase', { boost: 4 });

  this.field('suffix', { boost: 1 });
  this.field('numbering', { boost: 1 });
})

forEach(dataset.periodCollections, authority => {
  sources[authority.id] = authority.source

  forEach(authority.definitions, period => {
    period.sourceID = authority.id;

    periods[period.id] = period;

    index.add(Object.assign({
      id: period.id,
    }, tokenize(period.label)))
  })
})

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
