"use strict";

/* eslint-disable no-console */

const { PORT } = require('../src/consts')
    , data = require('../src/data')
    , server = require('../src/server')

const args = process.argv.slice(2)

if (args.length !== 1) {
  console.error('Usage: periodo-reconciler [PeriodO JSON file]')
  process.exit(1)
}

server(data.load(args[0])).listen(PORT)

console.log(
  'PeriodO reconciliation server running on http://localhost:%d', PORT
)
