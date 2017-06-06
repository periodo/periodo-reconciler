const Immutable = require('immutable')
    , { getDisplayTitle } = require('periodo-utils').items.source
    , { getEarliestYear
      , getLatestYear } = require('periodo-utils').items.terminus
    , { periods, sources } = require('./data')

module.exports = function format(periodID) {
  const period = Immutable.fromJS(periods[periodID])
      , source = Immutable.fromJS(sources[period.get('sourceID')])

  return `
    <style>
      dl { font-family: sans-serif }
      dh { color: #93a1a1 }
      dd { margin-bottom: 1em }
      p { margin: 0.5em 0 }
    </style>
    <dl>
      <dh>Period</dh>
      <dd>
        <p>${period.get('label')}</p>
        <p><i>${period.get('localizedLabels', '')}</i></p>
      </dd>

      <dh>Source</dh>
      <dd>
        <p>${getDisplayTitle(source)}</p>
        <p>
          <i>contains ${source.get('numDefinitions')} period definitions</i>
        </p>
      </dd>

      <dh>Earliest start</dh>
      <dd>
        <p>${period.getIn(['start', 'label'])}</p>
        <p><i>ISO year ${getEarliestYear(period.get('start'))}</i></p>
      </dd>

      <dh>Latest stop</dh>
      <dd>
        <p>${period.getIn(['stop', 'label'])}</p>
        <p><i>ISO year ${getLatestYear(period.get('stop'))}</i></p>
      </dd>

      <dh>Spatial coverage</dh>
      <dd>
        <p>${period.get('spatialCoverageDescription')}</p>
        <p><i>${period.get('spatialCoverage', '')}</i></p>
        </p>
      </dd>
    </dl>
  `
}
