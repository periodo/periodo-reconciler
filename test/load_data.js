"use strict";

const data = require('../src/data')

const DATA_FILE = process.env['PERIODO_DATASET'] || 'p0d.json'

module.exports = () => data.load(DATA_FILE)
