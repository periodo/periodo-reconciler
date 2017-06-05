"use strict";

const Type = require('union-type')

const Interval = Type(
  { Interval: [Number, Number]
  , InvalidInterval: []
  }
)

Object.defineProperty(Interval.prototype, 't1',
  { enumerable: true
  , get() { return this.isProper() ? this[0] : this[1] }
  }
)

Object.defineProperty(Interval.prototype, 't2',
  { enumerable: true
  , get() { return this.isProper() ? this[1] : this[0] }
  }
)

Interval.prototype.isProper = function() {
  return Interval.case({
    Interval: () => (this[0] < this[1]),
    InvalidInterval: () => false
  }, this)
}

Interval.prototype.length = function() {
  return Interval.case({
    Interval: () => (this.t2 - this.t1),
    InvalidInterval: () => undefined
  }, this)
}

Interval.prototype.contains = function(t) {
  return Interval.case({
    Interval: () => (t >= this.t1 && t <= this.t2),
    InvalidInterval: () => false
  }, this)
}

Interval.prototype.overlaps = function(interval) {
  return Interval.case({
    Interval: () => Math.max(0, Math.min(
      interval.t2 - this.t1, this.t2 - interval.t1)),
    InvalidInterval: () => 0
  }, this)
}

module.exports = Interval
