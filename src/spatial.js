"use strict";

const TextIndex = require('elasticlunr')

TextIndex.tokenizer.setSeperator(/[\s\-,]+/)

module.exports = {
  index: docs => {
    const index = TextIndex()
    index.addField('spatialCoverage')
    index.addField('spatialCoverageDescription')
    index.pipeline.reset()

    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query) }
  }
}

