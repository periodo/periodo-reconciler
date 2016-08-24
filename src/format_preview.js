const Immutable = require('immutable')
    , { getDisplayTitle } = require('periodo-utils').items.source
    , { periods, sources } = require('./data')

module.exports = function format(periodID) {
  const period = Immutable.fromJS(periods[periodID])
      , source = Immutable.fromJS(sources[period.get('sourceID')])

  return `
    <dl>
      <dh>Source</dh>
      <dd>
        <div>${getDisplayTitle(source)}</div>
        <p><i>(contains ${source.get('numDefinitions')} period definitions)</i></p>
      </dd>

      <dh>Earliest start</dh>
      <dd>${period.getIn(['start', 'label'])}</dd>

      <br />

      <dh>Latest stop</dh>
      <dd>${period.getIn(['stop', 'label'])}</dd>

      <br />

      <dh>Spatial coverage description</dh>
      <dd>${period.get('spatialCoverageDescription')}</dd>
    </dl>
  `
}
