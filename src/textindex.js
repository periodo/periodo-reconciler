"use strict";

const R = require('ramda')
    , elasticlunr = require('elasticlunr')
    , unorm = require('unorm')
    , tokenize = require('./tokenize')

const register = (f, name) => {
  delete elasticlunr.Pipeline.registeredFunctions[name]
  elasticlunr.Pipeline.registerFunction(f, name)
  return f
}

// http://www.unicode.org/charts/PDF/U0300.pdf
const COMBINING_CHARACTERS_REGEX = /[\u0300-\u036f]/g

function filterCombiningCharacters(token) {
  return unorm.nfd(token).replace(COMBINING_CHARACTERS_REGEX, '')
}

const removeWords = words => {
  const words_has = R.fromPairs(words.map(x => [x, true]))
  const filter = token => words_has[token] ? undefined : token
  return register(filter, words.join('|'))
}

const SPECIAL_CHARS = '^$\\.*+?()[]{}`'

const escape = c => SPECIAL_CHARS.includes(c) ? `\\${c}` : c

const removeChars = chars => {
  const filter = token => token.replace(
    RegExp(`[${chars.map(escape).join('')}]+`, 'g'), '')
  return register(filter, chars.join(''))
}

// global elasticlunr configuration
elasticlunr.tokenizer = tokenize
register(filterCombiningCharacters, 'filterCombiningCharacters')

module.exports = ({fields, filters, stopwords, stopchars}) => {
  const index = new elasticlunr.Index

  for (const field of (fields)) {
    index.addField(field)
  }

  index.pipeline.reset()

  if (stopwords) {
    index.pipeline.add(removeWords(stopwords))
  }

  if (filters) {
    for (const filter of filters) {
      index.pipeline.add(elasticlunr.Pipeline.registeredFunctions[filter])
    }
  }

  if (stopchars) {
    index.pipeline.add(removeChars(stopchars))
  }

  return index
}
