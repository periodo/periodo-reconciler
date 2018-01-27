"use strict";

const TextIndex = require('./textindex')

module.exports = {
  index: docs => {
    const index = TextIndex(
      { fields: ['spatialCoverage', 'spatialCoverageDescription']
      , stopwords: ['and', 'or']
      }
    )
    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { spatialCoverage: {boost: 1, bool: 'AND'}
        , spatialCoverageDescription: {boost: 1, bool: 'AND'}
        }
      }) }
  }
}
