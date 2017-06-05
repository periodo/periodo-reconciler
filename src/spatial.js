"use strict";

const TextIndex = require('elasticlunr')

TextIndex.tokenizer.setSeperator(/[\s\-,]+/)

module.exports = {
  index: docs => {
    const index = TextIndex(function() {
      this.addField('spatialCoverage')
      this.addField('spatialCoverageDescription')
      this.pipeline.reset()
    })
    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { spatialCoverage: {boost: 1}
        , spatialCoverageDescription: {boost: 1}
        }
      }) }
  }
}

