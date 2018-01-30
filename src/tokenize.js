"use strict";

const R = require('ramda')
    , re = require('xregexp')
    , unorm = require('unorm')

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

const SEPARATOR = re(
`[\\s:/]+                         # whitespace, colons, or slashes,
 (?!                               # except before
   (?:\\b                          # words
     (?:                           # that:
       (?:                         # 1) consist of
         (?:i{1,3}|v|x{1,2}){1,3}  #    Roman numerals
         (?:[abc](?:[123])?)?      #    (possibly with letter/number suffixes)
       )                           # or
       | campaigns?                # 2) are period category terms
       | colon(?:y|ies)
       | conflicts?
       | conquests?
       | dynast(?:y|ies)
       | empires?
       | expeditions?
       | insurrections?
       | interventions?
       | invasions?
       | kingdoms?
       | monarch(?:y|ies)
       | movements?
       | occupations?
       | rebellions?
       | republics?
       | restorations?
       | revolts?
       | revolutions?
       | rule
       | uprisings?
       | wars?
     )
   \\b)
 )
`, 'x')

// e.g. ['early', 'bronze'] => ['early bronze']
const MODIFIERS = re(
`^
(?:
  1st
| 2nd
| 3rd
| ancient
| anglo
| cypro
| earl(?:y|ier)
| east(?:ern)?
| first
| french
| great
| greco
| king
| later?
| middle
| ne(?:o|w)
| north(?:ern)?
| old
| post
| pre
| romano?
| south(?:ern)?
| spanish
| west(?:ern)?
| \\d+th
)
$`, 'x')
const prependModifiers = R.pipe(
  R.reduce(
    ({prepend, tokens}, token) => {
      const t = `${prepend ? (prepend + ' ') : ''}${token}`
      return token.match(MODIFIERS)
        ? {prepend: t, tokens}
        : {tokens: R.append(t, tokens)}
    },
    {tokens: []}
  ),
  ({prepend, tokens}) => prepend ? R.append(prepend, tokens) : tokens
)

const tokenizeString = R.pipe(
  s => '' + s,
  R.trim,                                 // trim whitespace
  unorm.nfd,                              // normalize unicode
  R.toLower,                              // lowercase
  R.replace(/[\u0300-\u036f]/g, ''),      // remove combining characters
  R.replace(/-/g, ' '),                   // replace hyphens with spaces
  R.replace(/[!-.;-@[-`{-~]+/g, ''),      // remove punctuation
  R.replace(/\b[1-9]\b/g, arabicToRoman), // 1 -> i, 2 -> ii, etc.
  R.replace(/\b\d+\b/g, ''),              // remove remaining all-digit words
  R.split(SEPARATOR),                     // split into tokens
  R.reject(R.isEmpty),                    // filter out empty tokens
  prependModifiers                        // include e.g. 'early' in next token
)

module.exports = s => (
  R.isNil(s)
    ? []
    : Array.isArray(s)
      ? R.chain(tokenizeString, R.reject(R.isNil, s))
      : tokenizeString(s)
)
