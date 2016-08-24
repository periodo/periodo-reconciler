"use strict";

const http = require('http')
    , url = require('url')
    , formBody = require('body/form')
    , { METADATA, PORT } = require('../src/consts')
    , search = require('../src/search')
    , format = require('../src/format_preview')


const server = http.createServer((req, res) => {
  try {
    const { callback } = url.parse(req.url, true).query

    if (callback) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      res.write(`${callback}(${JSON.stringify(METADATA, true, '  ')})`);
      res.end('\n');
      return;
    }

    if (req.url.startsWith('/preview-')) {
      const periodID = req.url.replace('/preview-', '')

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(`<!doctype html><html><body bgcolor="white">${format(periodID)}`);
      res.end('\n');
      return;
    }

    formBody(req, {}, (err, body) => {
      if (body.queries) {
        const queries = JSON.parse(body.queries)
            , results = {}

        for (let i = 0; i < 20; i++) {
          const queryIndex = `q${i}`
              , query = queries[queryIndex]

          if (!query) break;

          results[queryIndex] = { result: search(query) }
        }

        res.statusCode = 200;
        res.write(JSON.stringify(results, true, '  '));
        res.end();
      }

      res.statusCode = 400;
      res.end('\n');
    });
  } catch (e) {
    res.statusCode = 500;
    process.stderr.write(e.toString() + '\n');
    res.end('\n');
  }
});

server.listen(PORT);
