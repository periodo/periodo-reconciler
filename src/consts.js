"use strict";

const PORT = 8142

const ROOT = `http://localhost:${PORT}`

const DEFAULT_TYPE = {
  id: 'http://www.w3.org/2004/02/skos/core#Concept',
  name: 'Period definition',
}

const PROPERTIES =
  [ {id: 'location', name: 'Spatial coverage'}
  , {id: 'start', name: 'Year or start year'}
  , {id: 'stop', name: 'End year'}
  ]

const METADATA = {
  name: 'PeriodO reconciliation service',
  identifierSpace: 'https://www.ietf.org/rfc/rfc3986.txt',
  schemaSpace: 'https://www.ietf.org/rfc/rfc3986.txt',
  defaultTypes: [DEFAULT_TYPE],
  view: {url: '{{id}}'},
  preview: {
    width: 480,
    height: 480,
    url: ROOT + '/preview?id={{id}}'
  },
  suggest: {
    property: {
      service_url: ROOT,
      service_path: '/suggest/properties'
    }
  }
}

const WEIGHTS =
  { label: 1
  , spatial: 1
  , temporal: 1
  }

module.exports =
  { PORT
  , DEFAULT_TYPE
  , PROPERTIES
  , METADATA
  , WEIGHTS
  }
