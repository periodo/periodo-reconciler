"use strict";

const R = require('ramda')
    , { readFileSync } = require('fs')
    , elasticlunr = require('elasticlunr')
    , unorm = require('unorm')

const register = (f, name) => {
  delete elasticlunr.Pipeline.registeredFunctions[name]
  elasticlunr.Pipeline.registerFunction(f, name)
  return f
}

// scoring: [{ref: 'foo', score: 0.7}, {ref: 'bar', score: 1.1}]
// scores: {foo: 0.7, bar: 1.1}
const scoringToScores = choices => scoring => R.fromPairs(scoring
  .filter(({ref}) => choices.indexOf(ref) >= 0)
  .map(({ref, score}) => [ref, score])
)

const pairwisePreferences = (scorings, weights, choices) => {
  if (weights && weights.length !== scorings.length) {
    throw new Error(`${scorings.length} scorings but ${weights.length} weights`)
  }

  const _choices = choices
    ? choices
    : R.uniq(R.flatten(scorings).map(({ref}) => ref)).sort()

  const _scores = scorings.map(scoringToScores(_choices))

  const _weights = weights === undefined
    ? Array(scorings.length).fill(1) : weights

  const countPreferences = (x, y) => _scores.reduce(
    (count, scores, i) => (
      (scores[x] || 0) > (scores[y] || 0) ? count + _weights[i] : count
    ), 0)

  return (
    [ _choices
    , _choices.map(x => _choices.map(y => countPreferences(x, y)))
    ]
  )
}

const stopwords = words => {
  const words_has = R.fromPairs(words.map(x => [x, true]))
  return register(
    token => words_has[token] ? undefined : token,
    words.join('|'))
}

const SPECIAL_CHARS = '^$\\.*+?()[]{}`'

const escape = c => SPECIAL_CHARS.includes(c) ? `\\${c}` : c

const removeCharacters = chars => register(
  token => token.replace(RegExp(`[${chars.map(escape).join('')}]+`, 'g'), ''),
  chars.join('')
)

// http://www.unicode.org/charts/PDF/U0300.pdf
const COMBINING_CHARACTERS_REGEX = /[\u0300-\u036f]/g

function filterCombiningCharacters(token) {
  return unorm.nfd(token).replace(COMBINING_CHARACTERS_REGEX, '')
}
register(filterCombiningCharacters, 'filterCombiningCharacters')

// "or at most 1-20 -- no one has phase numbering beyond 20" -- Adam
const ROMAN_NUMERALS = [
  '',
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'viii',
  'ix',
  'x',
  'xi',
  'xii',
  'xiii',
  'xiv',
  'xv',
  'xvi',
  'xvii',
  'xviii',
  'xix',
  'xx',
]

function convertToRomanNumerals(token) {
  const int = parseInt(token, 10)
  if (isNaN(int) || int < 1 || int > 20) {
    return token
  } else {
    return ROMAN_NUMERALS[int]
  }
}
register(convertToRomanNumerals, 'convertToRomanNumerals')

const loadJSON = path => JSON.parse(readFileSync(path, 'utf8'))

module.exports = {
  pairwisePreferences,
  stopwords,
  removeCharacters,
  loadJSON,
  filterCombiningCharacters,
  convertToRomanNumerals }
