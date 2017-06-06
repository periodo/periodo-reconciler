#! /usr/bin/env node

"use strict";

/* eslint-disable no-console */

const { resolve } = require('path')
    , { PORT } = require('../src/consts')
    , data = require('../src/data')
    , server = require('../src/server')

const args = process.argv.slice(2)

if (args.length !== 1) {
  console.error('Usage: periodo-reconciler [PeriodO JSON file]')
  process.exit(1)
}

console.log(
  `Reconciling against %s`, resolve(args[0])
)
server(data.load(args[0])).listen(PORT)

console.log(
  'Reconciliation server running on http://localhost:%d', PORT
)
