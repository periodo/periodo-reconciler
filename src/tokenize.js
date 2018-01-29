"use strict";

const R = require('ramda')
    , re = require('xregexp');

const SEPARATOR = re(
`\\s+(?!           # spaces, except before:
   (?:\\b
     (?:
       (?:
         (?:i{1,3}|v|x{1,2}){1,3}  # Roman numerals
         (?:[abc](?:[123])?)?      # possibly with letter/number suffixes
       )
       | wars?                     # or "war[s]"
     )
   \\b)
 )
 | [\\-,:()]+      # other separating punctuation
 | \\b\\d{2,4}\\b  # years, maybe
`, 'x');

// e.g. ['early', 'bronze'] => ['early bronze']
const MODIFIERS = ['early', 'middle', 'late']
const prependModifiers = R.pipe(
  R.reduce(
    ({prepend, tokens}, token) => {
      const t = `${prepend ? (prepend + ' ') : ''}${token}`
      return MODIFIERS.includes(token)
        ? {prepend: t, tokens}
        : {tokens: R.append(t, tokens)}
    },
    {tokens: []}
  ),
  ({prepend, tokens}) => prepend ? R.append(prepend, tokens) : tokens
)

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
]

function arabicToRoman(token) {
  const int = parseInt(token, 10)
  if (isNaN(int) || int < 1 || int > 9) {
    return token
  } else {
    return ROMAN_NUMERALS[int]
  }
}

const tokenizeString = R.pipe(
  s => '' + s,
  R.trim,
  R.toLower,
  R.replace(/\b[1-9]\b/, arabicToRoman),
  R.split(SEPARATOR),
  R.reject(R.isEmpty),
  prependModifiers
)

module.exports = s => (
  R.isNil(s)
    ? []
    : Array.isArray(s)
      ? R.chain(tokenizeString, R.reject(R.isNil, s))
      : tokenizeString(s)
)
