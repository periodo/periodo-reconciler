"use strict";

const test = require('tape')
    , Interval = require('../src/interval')

test('intervals can be proper or not', t => {
  const proper = Interval.Interval(2,3)
  const improper = Interval.Interval(2,2)
  const backward = Interval.Interval(3,2)
  const invalid = Interval.InvalidInterval
  t.plan(4)
  t.true(proper.isProper())
  t.false(improper.isProper())
  t.false(backward.isProper())
  t.false(invalid.isProper())
})

test('valid intervals have lengths', t => {
  t.plan(3)
  t.equal(Interval.Interval(2, 2).length(), 1)
  t.equal(Interval.Interval(2, 4).length(), 3)
  t.equal(Interval.Interval(4, 3).length(), 2)
})

test('invalid intervals do not have lengths', t => {
  t.plan(1)
  t.equal(Interval.InvalidInterval.length(), undefined)
})

test('proper intervals contain points', t => {
  const interval = Interval.Interval(3, 5)
  t.plan(5)
  t.false(interval.contains(2))
  t.true(interval.contains(3))
  t.true(interval.contains(4))
  t.true(interval.contains(5))
  t.false(interval.contains(6))
})

test('zero-length intervals contain points', t => {
  const interval = Interval.Interval(3, 3)
  t.plan(3)
  t.false(interval.contains(2))
  t.true(interval.contains(3))
  t.false(interval.contains(4))
})

test('improper intervals contain points', t => {
  const interval = Interval.Interval(5, 3)
  t.plan(5)
  t.false(interval.contains(2))
  t.true(interval.contains(3))
  t.true(interval.contains(4))
  t.true(interval.contains(5))
  t.false(interval.contains(6))
})

test('invalid intervals contain nothing', t => {
  const interval = Interval.InvalidInterval
  t.plan(5)
  t.false(interval.contains(2))
  t.false(interval.contains(3))
  t.false(interval.contains(4))
  t.false(interval.contains(5))
  t.false(interval.contains(6))
})

test('proper intervals may overlap', t => {
  const i6to10 = Interval.Interval(6, 10)
      , i4to8 = Interval.Interval(4, 8)
      , i3to7 = Interval.Interval(3, 7)
      , i2to6 = Interval.Interval(2, 6)
      , i1to5 = Interval.Interval(1, 5)
  t.plan(9)
  t.equal(i6to10.overlaps(i6to10), 5)
  t.equal(i6to10.overlaps(i4to8), 3)
  t.equal(i4to8.overlaps(i6to10), 3)
  t.equal(i6to10.overlaps(i3to7), 2)
  t.equal(i3to7.overlaps(i6to10), 2)
  t.equal(i6to10.overlaps(i2to6), 1)
  t.equal(i2to6.overlaps(i6to10), 1)
  t.equal(i6to10.overlaps(i1to5), 0)
  t.equal(i1to5.overlaps(i6to10), 0)
})

test('improper intervals may overlap', t => {
  const i10to6 = Interval.Interval(10, 6)
      , i4to8 = Interval.Interval(4, 8)
      , i3to7 = Interval.Interval(3, 7)
      , i6to2 = Interval.Interval(6, 2)
      , i1to5 = Interval.Interval(1, 5)
  t.plan(9)
  t.equal(i10to6.overlaps(i10to6), 5)
  t.equal(i10to6.overlaps(i4to8), 3)
  t.equal(i4to8.overlaps(i10to6), 3)
  t.equal(i10to6.overlaps(i3to7), 2)
  t.equal(i3to7.overlaps(i10to6), 2)
  t.equal(i10to6.overlaps(i6to2), 1)
  t.equal(i6to2.overlaps(i10to6), 1)
  t.equal(i10to6.overlaps(i1to5), 0)
  t.equal(i1to5.overlaps(i10to6), 0)
})

test('invalid intervals overlap nothing', t => {
  const interval = Interval.InvalidInterval
  t.plan(1)
  t.equal(interval.overlaps(interval), 0)
})

test('expand broadens x2, up to 100', t => {
  const interval401 = Interval.Interval(600, 1000)
  const interval41 = Interval.Interval(60, 100)
  const interval5 = Interval.Interval(6, 10)
  const interval4 = Interval.Interval(6, 9)
  t.plan(4)
  t.deepEqual(interval401.expand(), Interval.Interval(550, 1050))
  t.deepEqual(interval41.expand(), Interval.Interval(39, 121))
  t.deepEqual(interval5.expand(), Interval.Interval(3, 13))
  t.deepEqual(interval4.expand(), Interval.Interval(4, 11))
})
