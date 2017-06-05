"use strict";

const test = require('tape')
    , label = require('../src/spatial')

test('sanity test 1', t => {
  const docs = [
    {id: 'unranked', spatialCoverage: 'Iraq'},
    {id: 'rank0', spatialCoverage: 'Iran'}
  ]
  const results = label.index(docs).search('Iran')
  t.plan(1)
  t.same(results.map(result => result.ref), ['rank0'])
})

test('sanity test 2', t => {
  const docs = [
    {id: 'rank1', spatialCoverage: 'Iraq, Iran'},
    {id: 'rank0', spatialCoverage: 'Iraq'}
  ]
  const results = label.index(docs).search('Iraq')
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0', 'rank1'])
})

test('sanity test 3', t => {
  const docs = [
    { id: 'rank1'
    , spatialCoverageDescription: 'Eastern provinces of Middle Earth'
    },
    { id: 'rank0'
    , spatialCoverage: 'Middle-earth, Elsewhere'
    }
  ]
  const results = label.index(docs).search('Middle Earth')
  t.plan(1)
  t.same(results.map(({ref}) => ref), ['rank0', 'rank1'])
})

