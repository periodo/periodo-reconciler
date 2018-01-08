"use strict";

const test = require('tape')
    , Interval = require('../src/interval')
    , { Query, score, index } = require('../src/temporal')

test('scoring intervals for point queries is hit or miss', t => {
  t.plan(5)
  t.equal(score(Query.PointQuery(1), Interval.Interval(2, 4)), 0.0) // miss
  t.equal(score(Query.PointQuery(2), Interval.Interval(2, 4)), 1.0) // hit
  t.equal(score(Query.PointQuery(3), Interval.Interval(2, 4)), 1.0) // hit
  t.equal(score(Query.PointQuery(4), Interval.Interval(2, 4)), 1.0) // hit
  t.equal(score(Query.PointQuery(5), Interval.Interval(2, 4)), 0.0) // miss
})

test('scoring intervals for interval queries', t => {
  const query = Query.IntervalQuery(Interval.Interval(6, 10))
  t.plan(5)
  t.equal(score(query, Interval.Interval(6, 10)), 1.0)
  t.equal(score(query, Interval.Interval(4, 8)),  0.6)
  t.equal(score(query, Interval.Interval(9, 10)), (4 / 7.0))
  t.equal(score(query, Interval.Interval(3, 7)),  0.4)
  t.equal(score(query, Interval.Interval(1, 5)),  0.0)
})

test('point query', t => {
  const docs = [
    {id: 'rank1', start: {in: {year: 300}}, stop: {in: {year: 500}}},
    {id: 'rank0', start: {in: {year: 100}}, stop: {in: {year: 300}}},
    {id: 'unranked', start: {in: {year: 500}}, stop: {in: {year: 700}}}
  ]
  const results = index(docs).search(200)
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0', 'rank1'])
})

test('point query disguised as interval', t => {
  const docs = [
    {id: 'rank1', start: {in: {year: 300}}, stop: {in: {year: 500}}},
    {id: 'rank0', start: {in: {year: 100}}, stop: {in: {year: 300}}},
    {id: 'unranked', start: {in: {year: 500}}, stop: {in: {year: 700}}}
  ]
  const results = index(docs).search(200, 200)
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0', 'rank1'])
})

test('interval query', t => {
  const docs = [
    {id: 'unranked', start: {in: {year: 100}}, stop: {in: {year: 450}}},
    {id: 'rank4', start: {in: {year: 100}}, stop: {in: {year: 550}}},
    {id: 'rank3', start: {in: {year: 300}}, stop: {in: {year: 700}}},
    {id: 'rank2', start: {in: {earliestYear: 900}}, stop: {in: {year: 1000}}},
    {id: 'rank1', start: {in: {year: 400}}, stop: {in: {year: 800}}},
    {id: 'rank0', start: {in: {year: 600}}, stop: {in: {latestYear: 1000}}}
  ]
  const results = index(docs).search(600, 1000)
  t.plan(1)
  t.same(
    results.map(({ref}) => ref),
    ['rank0', 'rank1', 'rank2', 'rank3', 'rank4']
  )
})

test('undefined queries return zero results', t => {
  const docs = [
    {id: 'unranked', start: {in: {year: 100}}, stop: {in: {year: 500}}},
    {id: 'rank3', start: {in: {year: 300}}, stop: {in: {year: 700}}},
    {id: 'rank2', start: {in: {earliestYear: 900}}, stop: {in: {year: 1000}}},
    {id: 'rank1', start: {in: {year: 400}}, stop: {in: {year: 800}}},
    {id: 'rank0', start: {in: {year: 600}}, stop: {in: {latestYear: 1000}}}
  ]
  const results = index(docs).search()
  t.plan(1)
  t.same(results, [])
})
