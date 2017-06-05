"use strict";

const TextIndex = require('elasticlunr')
    , { stopwords } = require('./utils')

TextIndex.tokenizer.setSeperator(/[\s\-,:]+/)

module.exports = {
  index: docs => {
    const index = TextIndex(function() {
      this.addField('label')
      this.addField('localizedLabels')
      this.pipeline.reset()
      this.pipeline.add(stopwords(['period']))
    })
    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { label: {boost: 2, bool: 'AND'}
        , localizedLabels: {boost: 1, bool: 'AND'}
        }
      })
    }
  }
}


