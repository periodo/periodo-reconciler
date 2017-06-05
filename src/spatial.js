"use strict";

const TextIndex = require('elasticlunr')
    , { stopwords } = require('./utils')

TextIndex.tokenizer.setSeperator(/[\s\-,:]+/)

module.exports = {
  index: docs => {
    const index = TextIndex(function() {
      this.addField('spatialCoverage')
      this.addField('spatialCoverageDescription')
      this.pipeline.reset()
      this.pipeline.add(stopwords(['and', 'or']))
    })
    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { spatialCoverage: {boost: 1, bool: 'AND'}
        , spatialCoverageDescription: {boost: 1, bool: 'AND'}
        }
      }) }
  }
}

