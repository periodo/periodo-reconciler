"use strict";

const R = require('ramda')
    , elasticlunr = require('elasticlunr')
    , tokenize = require('./tokenize')

const register = (f, name) => {
  delete elasticlunr.Pipeline.registeredFunctions[name]
  elasticlunr.Pipeline.registerFunction(f, name)
  return f
}

const removeWords = words => {
  const words_has = R.fromPairs(words.map(x => [x, true]))
  const filter = token => words_has[token] ? undefined : token
  return register(filter, words.join('|'))
}

// global elasticlunr configuration
elasticlunr.tokenizer = tokenize

module.exports = ({fields, stopwords}) => {
  const index = new elasticlunr.Index

  for (const field of (fields)) {
    index.addField(field)
  }

  index.pipeline.reset()

  if (stopwords) {
    index.pipeline.add(removeWords(stopwords))
  }

  return index
}
