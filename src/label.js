"use strict";

const TextIndex = require('elasticlunr')

TextIndex.tokenizer.setSeperator(/[\s\-,]+/)

module.exports = {
  index: docs => {
    const index = TextIndex()
    index.addField('label')
    index.addField('localizedLabels')
    index.pipeline.reset()

    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { label: {boost: 2}
        , localizedLabels: {boost: 1}
        }
      })
    }
  }
}


