"use strict";

const test = require('tape')
    , request = require('supertest')
    , serve = require('../bin/serve')
    , { METADATA } = require('../src/consts')

test('GET / returns service metadata', t => {
  request(serve)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.same(res.body, METADATA)
      t.end()
    })
})

test('GET /?callback=foo returns service metadata via JSONP', t => {
  request(serve)
    .get('/')
    .query('callback=foo')
    .expect(200)
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.same(res.text, `foo(${JSON.stringify(METADATA)})`)
      t.end()
    })
})

test('GET /?queries=... returns results', t => {
  const query = {foo: {query: 'bronze'}}
  request(serve)
    .get('/')
    .query(`queries=${JSON.stringify(query)}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.ok('foo' in res.body)
      t.ok('result' in res.body.foo)
      t.ok('id'    in res.body.foo.result[0])
      t.ok('name'  in res.body.foo.result[0])
      t.ok('type'  in res.body.foo.result[0])
      t.ok('score' in res.body.foo.result[0])
      t.ok('match' in res.body.foo.result[0])
      t.end()
    })
})

test('GET /?callback=foo&queries=... returns results via JSONP', t => {
  const query = {foo: {query: 'bronze'}}
  request(serve)
    .get('/')
    .query(`queries=${JSON.stringify(query)}`)
    .query('callback=foo')
    .expect(200)
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      const f = new Function('foo', res.text)
      f(json => {
        t.ok('foo' in json)
        t.ok('result' in json.foo)
        t.ok('id'    in json.foo.result[0])
        t.ok('name'  in json.foo.result[0])
        t.ok('type'  in json.foo.result[0])
        t.ok('score' in json.foo.result[0])
        t.ok('match' in json.foo.result[0])
        t.end()
      })
    })
})

test('POST / with queries in body returns results', t => {
  const query = {foo: {query: 'bronze'}}
  request(serve)
    .post('/')
    .send(`queries=${JSON.stringify(query)}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.ok('foo' in res.body)
      t.ok('result' in res.body.foo)
      t.ok('id'    in res.body.foo.result[0])
      t.ok('name'  in res.body.foo.result[0])
      t.ok('type'  in res.body.foo.result[0])
      t.ok('score' in res.body.foo.result[0])
      t.ok('match' in res.body.foo.result[0])
      t.end()
    })
})

test('GET /?queries={"foo":{"limit":1... returns 1 result', t => {
  const query = {foo: {query: 'bronze', limit: 1}}
  request(serve)
    .get('/')
    .query(`queries=${JSON.stringify(query)}`)
    .query('limit=1')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.ok('foo' in res.body)
      t.ok('result' in res.body.foo)
      t.equal(res.body.foo.result.length, 1)
      t.end()
    })
})

test('malformed queries return bad request', t => {
  request(serve)
    .get('/')
    .query(`queries={`)
    .expect(400)
    .expect('Content-Type', 'text/plain')
    .end((err, res) => {
      t.error(err)
      t.equal(res.text, 'malformed queries')
      t.end()
    })
})

test('GET /preview?id=... returns HTML', t => {
  request(serve)
    .get('/preview')
    .query('id=http://n2t.net/ark:/99152/p0qhb666zg4')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err) => {
      t.error(err)
      t.end()
    })
})

test('GET /preview with bogus id returns 404', t => {
  request(serve)
    .get('/preview')
    .query('id=bogus')
    .expect(404)
    .expect('Content-Type', 'text/plain')
    .end((err) => {
      t.error(err)
      t.end()
    })
})

test('GET /preview without id returns 404', t => {
  request(serve)
    .get('/preview')
    .expect(404)
    .expect('Content-Type', 'text/plain')
    .end((err) => {
      t.error(err)
      t.end()
    })
})

test('GET /suggest/properties returns suggestions', t => {
  request(serve)
    .get('/suggest/properties')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      t.equal(res.body.code, '/api/status/ok')
      t.equal(res.body.status, '200 OK')
      t.same(res.body.result,
        [ {id: 'location', name: 'Spatial coverage'}
        , {id: 'start', name: 'Year or start year'}
        , {id: 'stop', name: 'End year'}
        ]
      )
      t.end()
    })
})

test('GET /suggest/properties?callback=foo returns suggests via JSONP', t => {
  request(serve)
    .get('/suggest/properties')
    .query('callback=foo')
    .expect(200)
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .end((err, res) => {
      t.error(err)
      const f = new Function('foo', res.text)
      f(json => {
        t.equal(json.code, '/api/status/ok')
        t.equal(json.status, '200 OK')
        t.same(json.result,
          [ {id: 'location', name: 'Spatial coverage'}
          , {id: 'start', name: 'Year or start year'}
          , {id: 'stop', name: 'End year'}
          ]
        )
        t.end()
      })
    })
})
