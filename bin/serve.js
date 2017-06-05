"use strict";

/* eslint-disable no-console */

const http = require('http')
    , route = require('micro-route')
    , url = require('url')
    , bodyParse = require('urlencoded-body-parser')
    , map = require('lodash.map')
    , fromPairs = require('lodash.frompairs')
    , { METADATA, PORT, PROPERTIES } = require('../src/consts')
    , search = require('../src/search')
    , format = require('../src/format_preview')
    , { periods } = require('../src/data')

const sendJSON = (callback, object, res) => {
  res.statusCode = 200
  if (callback) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    res.write(`${callback}(${JSON.stringify(object)})`)
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.write(JSON.stringify(object, null, 2))
  }
  res.end()
}

const sendHTML = (html, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(html)
  res.end()
}

const sendError = (statusCode, message, res) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'text/plain')
  res.write(message)
  res.end()
}

async function parseRequestParams(req) {
  return req.method === 'GET'
    ? url.parse(req.url, true).query
    : await bodyParse(req)
}

const parseQueries = queries => {
  try {
    const o = JSON.parse(queries)
    return o !== null && typeof o === 'object' ? o : null
  } catch (e) {
    return null
  }
}

const root = route('/', ['GET', 'POST'])
const preview = route('/preview', 'GET')
const suggest = route('/suggest/properties', 'GET')

const rootHandler = ({queries, callback}, res) => {
  if (queries) {
    const parsedQueries = parseQueries(queries)
    if (parsedQueries) {
      const results = fromPairs(
        map(parsedQueries, (query, key) => [key, {result: search(query)}])
      )
      sendJSON(callback, results, res)
    } else {
      sendError(400, 'malformed queries', res)
    }
  } else {
    sendJSON(callback, METADATA, res)
  }
}

const previewHandler = ({id}, res) => {
  if (id && id in periods) {
    sendHTML(`<!doctype html><html><body bgcolor="white">
          ${format(id)}`, res)
  } else {
    sendError(404, `'${id}' is not a period definition URI`, res)
  }
}

const suggestHandler = ({callback}, res) => {
  const json = {code: '/api/status/ok', status: '200 OK', result: PROPERTIES}
  sendJSON(callback, json, res)
}

const server = http.createServer((req, res) => {

  parseRequestParams(req).then(params => {

    if (root(req)) {
      rootHandler(params, res)

    } else if (preview(req)) {
      previewHandler(params, res)

    } else if (suggest(req)) {
      suggestHandler(params, res)
    }
  })
})

if (require.main === module) {
  server.listen(PORT)
  console.log(
    'PeriodO reconciliation server running on http://localhost:%d', PORT)
}

module.exports = server
