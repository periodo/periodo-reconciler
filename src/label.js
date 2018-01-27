"use strict";

const TextIndex = require('./textindex')
    , { convertToRomanNumerals
      , filterCombiningCharacters } = require('./utils')

module.exports = {
  index: docs => {
    const index = TextIndex(
      { fields: ['label', 'localizedLabels']
      , filters: [filterCombiningCharacters, convertToRomanNumerals]
      , stopwords: ['period', 'age']
      , stopchars: ['.']
      }
    )
    docs.forEach(doc => index.addDoc(doc))

    return { search: query => index.search(query,
      { fields:
        { label: {boost: 2}
        , localizedLabels: {boost: 1}
        }
      , bool: 'OR'
      })
    }
  }
}
