"use strict";

const TextIndex = require('./textindex')

module.exports = {
  index: docs => {
    const index = TextIndex(
      { fields: ['label', 'localizedLabels']
      , stopwords: [
          'a',
          'ad',
          'age',
          'and',
          'b',
          'bc',
          'bce',
          'c',
          'ca',
          'd',
          'epoch',
          'era',
          'for',
          'in',
          'of',
          'or',
          'period',
          'periods',
          'the',
          'to',
          'with',
          'years'
        ]
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
