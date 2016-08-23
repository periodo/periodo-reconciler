"use strict";

const PERIOD_TYPE = {
  id: '/period',
  name: 'PeriodO Time Period',
}

const METADATA = {
  name: 'Periodo reconciliation service',
  defaultTypes: { period: PERIOD_TYPE },
  view: {
    url: "http://n2t.net/ark:/99152/{{id}}"
  }
}

module.exports = { PERIOD_TYPE, METADATA }
