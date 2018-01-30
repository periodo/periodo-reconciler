"use strict";

const Type = require('union-type')
    , Interval = require('./interval')

const Query = Type({PointQuery: [Number], IntervalQuery: [Interval]})

const score = Query.caseOn({
  PointQuery: (q, interval) => interval.contains(q) ? 1.0 : 0.0,
  IntervalQuery: (q, interval) => q.length() > 0
      ? (2.0 * interval.overlaps(q)) / (q.length() + interval.length())
      : interval.contains(q.t1) ? 1.0 : 0.0
})

class IntervalIndex {
  constructor() {
    this.docs = []
    this.intervalOf = doc => Interval.Interval(doc.start, doc.stop)
  }

  set intervalExtractor(f) {
    this.intervalOf = f
  }

  addDoc(doc) {
    this.docs.push({id: doc.id, interval: this.intervalOf(doc)})
  }

  search(start, stop) {
    const _start = parseInt(start, 10)
        , _stop = parseInt(stop, 10)
    return isNaN(_start)
      ? isNaN(_stop)
          ? []
          : this._search(Query.PointQuery(_stop))
      : isNaN(stop)
          ? this._search(Query.PointQuery(_start))
          : this._search(Query.IntervalQuery(Interval.Interval(_start, _stop)))
  }

  _search(query) {
    const results = this.docs.reduce(
      (results, {id, interval}) => {
        let s = score(query, interval)
        if (s > 0) {
          return results.concat([{ref: id, score: s}])
        }
        // try again with expanded interval buffer for half the score
        s = score(query, interval.expand()) / 2.0
        return s > 0
          ? results.concat([{ref: id, score: s}])
          : results
      }, []
    )
    results.sort((a, b) => b.score - a.score)
    return results
  }
}

const intervalOf = period => period.start.in && period.stop.in
  ? Interval.Interval(
      parseInt(period.start.in.year || period.start.in.earliestYear, 10),
      parseInt(period.stop.in.year || period.stop.in.latestYear, 10)
    )
  : Interval.InvalidInterval

module.exports = {
  index: docs => {
    const index = new IntervalIndex()
    index.intervalExtractor = intervalOf

    docs.forEach(doc => index.addDoc(doc))

    return {
      search: (start, stop) => index
        .search(start, stop)
    }
  },
  Query,
  score
}
