"use strict";

const R = require('ramda')

const SEPARATOR = /[\s\-,:()]+|\d{3,}|[3-9]\d|2[1-9]/

const tokenizeString = R.pipe(
  s => '' + s,
  R.trim,
  R.toLower,
  R.split(SEPARATOR)
)

module.exports = s => (
  R.isNil(s)
    ? []
    : Array.isArray(s)
      ? R.chain(tokenizeString, R.reject(R.isNil, s))
      : tokenizeString(s)
)
