"use strict";

const TextIndex = require('elasticlunr')

TextIndex.tokenizer.setSeperator(/[\s\-,]+/)

module.exports = {
  index: docs => {
    const index = TextIndex(function() {
      this.addField('label')
      this.addField('localizedLabels')
      this.pipeline.reset()
    })
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


