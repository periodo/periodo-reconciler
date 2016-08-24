"use strict";

const HOSTNAME = 'http://localhost:8142'

const PORT = 8142

const PERIOD_TYPE = {
  id: '/period',
  name: 'PeriodO Time Period',
}

const METADATA = {
  name: 'Periodo reconciliation service',
  defaultTypes: { period: PERIOD_TYPE },
  view: {
    url: "http://n2t.net/ark:/99152/{{id}}"
  },
  preview: {
    width: 420,
    height: 420,
    url: HOSTNAME + '/preview-{{id}}'
  }
}

module.exports = { HOSTNAME, PORT, PERIOD_TYPE, METADATA }
