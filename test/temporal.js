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
  t.equal(score(query, Interval.Interval(4, 8)),  0.5)
  t.equal(score(query, Interval.Interval(9, 10)), 0.4)
  t.equal(score(query, Interval.Interval(3, 7)),  0.25)
  t.equal(score(query, Interval.Interval(1, 5)),  0.0)
})

test('point query', t => {
  const docs = [
    {id: 'rank0', start: {in: {year: 1}}, stop: {in: {year: 3}}},
    {id: 'unranked', start: {in: {year: 3}}, stop: {in: {year: 5}}}
  ]
  const results = index(docs).search(2)
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0'])
})

test('interval query', t => {
  const docs = [
    {id: 'unranked', start: {in: {year: 1}}, stop: {in: {year: 5}}},
    {id: 'rank3', start: {in: {year: 3}}, stop: {in: {year: 7}}},
    {id: 'rank2', start: {in: {earliestYear: 9}}, stop: {in: {year: 10}}},
    {id: 'rank1', start: {in: {year: 4}}, stop: {in: {year: 8}}},
    {id: 'rank0', start: {in: {year: 6}}, stop: {in: {latestYear: 10}}},
  ]
  const results = index(docs).search(6, 10)
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0', 'rank1', 'rank2', 'rank3'])
})

test('undefined queries return zero results', t => {
  const docs = [
    {id: 'unranked', start: {in: {year: 1}}, stop: {in: {year: 5}}},
    {id: 'rank3', start: {in: {year: 3}}, stop: {in: {year: 7}}},
    {id: 'rank2', start: {in: {earliestYear: 9}}, stop: {in: {year: 10}}},
    {id: 'rank1', start: {in: {year: 4}}, stop: {in: {year: 8}}},
    {id: 'rank0', start: {in: {year: 6}}, stop: {in: {latestYear: 10}}},
  ]
  const results = index(docs).search()
  t.plan(1)
  t.same(results, [])
})

