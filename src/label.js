"use strict";

const TextIndex = require('elasticlunr')
    , { convertRomanNumerals
      , filterCombiningCharacters
      , stopwords, removeCharacters } = require('./utils')

TextIndex.tokenizer.setSeperator(/[\s\-,:]+/)

module.exports = {
  index: docs => {
    const index = TextIndex(function() {
      this.addField('label')
      this.addField('localizedLabels')
      this.pipeline.reset()
      this.pipeline.add(stopwords(['period']))
      this.pipeline.add(filterCombiningCharacters)
      this.pipeline.add(convertRomanNumerals)
      this.pipeline.add(removeCharacters('.'))
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
