const Immutable = require('immutable')
    , { getDisplayTitle } = require('periodo-utils').items.source
    , { getEarliestYear
      , getLatestYear } = require('periodo-utils').items.terminus

module.exports = function format(periodID, periods, sources) {
  const period = Immutable.fromJS(periods[periodID])
      , source = Immutable.fromJS(sources[period.get('sourceID')])

  return `
    <style>
      dl {
        font-family: sans-serif;
        font-size: 13px !important;
        margin: 0.5em !important;
      }
      dh { color: #93a1a1 }
      dd {
        margin-bottom: 1em !important;
        margin-left: 1em !important;
      }
      p { margin: 0.5em 0; font-size: 13px !important; }
      a { color: #4272db; text-decoration: none }
    </style>
    <dl>
      <dh>Period</dh>
      <dd>
        <p><a target="_blank" href="${periodID}">${period.get('label')}</a></p>
        <p><i>${period.get('localizedLabels', '')}</i></p>
      </dd>

      <dh>Source</dh>
      <dd>
        <p>
          <a target="_blank"
             href="${periodID.slice(0, -4)}">${getDisplayTitle(source)}</a>
        </p>
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
