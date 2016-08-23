"use strict";


const PHASE_QUALIFIERS = [
  /^early/i,
  /^(mid|middle)/i,
  /^late/i,
]

const SUFFIXES = [
  /age$/i,
  /era$/i,
  /empire$/i,
  /phase$/i,
  /period$/i,
  /dynasty$/i,
]

const NUMBERING = [
  /\b(\d|I|II|III|IV|V|VI|VII|VIII|IX)(A|B|C|D)?$/,
  /\b(A)()$/i,
  /\b(B)()$/i,
  /\b(C)()$/i,
  /\b(D)()$/i,
]

function matchFirst(regexes, query) {
  for (let i = 0; i < regexes.length; i++) {
    const regex = regexes[i]
        , match = regex.exec(query)

    if (match) return { match, regex }
  }

  return null;
}

module.exports = function tokenize(string) {
  let label = string
    , phase
    , suffix
    , numbering

  const phaseMatch = matchFirst(PHASE_QUALIFIERS, label);
  if (phaseMatch) {
    phase = phaseMatch.match[0];
    label = label.replace(phaseMatch.regex, '').trim();
  }

  const numberingMatch = matchFirst(NUMBERING, label);
  if (numberingMatch) {
    numbering = numberingMatch.match[0];
    label = label.replace(numberingMatch.regex, '').trim();
  }

  const suffixMatch = matchFirst(SUFFIXES, label);
  if (suffixMatch) {
    suffix = suffixMatch.match[0];
    label = label.replace(suffixMatch.regex, '').trim();
  }

  return { originalLabel: string, label, phase, suffix, numbering }
}
