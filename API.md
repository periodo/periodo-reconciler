## The PeriodO reconciliation API

* [Describe the reconciliation service](#describe-the-reconciliation-service)
* [Reconcile period names (using `GET`)](#reconcile-period-names-using-get)
* [Reconcile period names (using `POST`)](#reconcile-period-names-using-post)
* [Suggest property names](#suggest-property-names)
* [Suggest period definitions](#suggest-period-definitions)
* [Preview period definition details](#preview-period-definition-details)


----
### Describe the reconciliation service

Fetch a description of the reconciliation service. Returns a JSON object as documented in the [service metadata](https://github.com/OpenRefine/OpenRefine/wiki/Reconciliation-Service-API#service-metadata) section of the OpenRefine Reconciliation API documentation.

* __URL path__

  `/`

* __Method__

  `GET`
  
* __Query parameters__

  _Required_ 
  
  none

  _Optional_
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Successful response__

  * __Status code__
  
    `200 OK`

    __Body content__

    ```json
    {
      "name": "PeriodO reconciliation service",
      "identifierSpace": "https://www.ietf.org/rfc/rfc3986.txt",
      "schemaSpace": "https://www.ietf.org/rfc/rfc3986.txt",
      "defaultTypes": [
        {
          "id": "http://www.w3.org/2004/02/skos/core#Concept",
          "name": "Period definition"
        }
      ],
      "view": {
        "url": "{{id}}"
      },
      "preview": {
        "width": 380,
        "height": 390,
        "url": "http://localhost:8142/preview?id={{id}}"
      },
      "suggest": {
        "property": {
          "service_url": "http://localhost:8142",
          "service_path": "/suggest/properties"
        },
        "entity": {
          "service_url": "http://localhost:8142",
          "service_path": "/suggest/entities",
          "flyout_service_path": "/preview?flyout=true&id=${id}"
        }
      }
    }
    ```
 
* __Sample call__

  ```
  curl http://localhost:8142/
  ```


----
### Reconcile period names (using `GET`)

Given a set of period names (and optionally some other descriptive
properties of the named periods), return a ranked list of matching
period definitions.

* __URL path__

  `/`

* __Method__

  `GET`
  
* __Query parameters__

  _Required_
  
  `queries=[JSON object literal]`
  
  The JSON object literal has arbitrary strings as keys, and as values
  JSON objects specifying individual queries. Individual queries
  *require*
  
  * a `query` key, the value of which is a string specifying a
    (partial) period name
  
  and *optionally* may have:
  
  * a `limit` key, the value of which is an integer specifying how
    many results to return (by default all potential matches are returned)

  * a `properties` key, the value of which is an array of JSON object
    literals, each of which *requires*:
    
    * a `p` key, the value of which matches the `id` of one of the
      [additional properties](#suggest-property-names) supported by the reconciliation service
      
    * a `v` key, the value of which is an appropriate value for the
      additional property
    
  For example, a JSON object specifying three queries:
  
  ```json
  {
    "basic-query": {
      "query": "北宋"
    },
    "limited-query": {
      "query": "bronze age",
      "limit": 1
    },
    "additional-properties-query": {
      "query": "Ранньоримський",
      "properties": [
        {
          "p": "location",
          "v": "Ukraine"
        },
        {
          "p": "start",
          "v": "200"
        },
        {
          "p": "stop",
          "v": "600"
        }
      ]
    }
  }
  ```

  _Optional_
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Successful response__

  * __Status code__
  
    `200 OK`

    __Body content__
    
    A successful request will return a JSON object with keys
    corresponding to the ones provided in the `queries` object. Each
    value is a JSON object with a single `result` key, the value of
    which is an array of JSON result objects. Each result object
    describes a single period definition and has the following keys:
    
    * `id` is the permanent identifier URL of the period definition
    * `name` is a descriptive label for the period definition
    * `type` asserts that the period definition is a [`skos:Concept`](https://www.w3.org/TR/skos-reference/#concepts)
    * `score` can be used for ranking matches by "closeness," lower
      numbers indicate closer matches
    * `match` will be `true` if and only if there was just a single match
    
    For example, a successful response to the `queries` above:

    ```json
    {
      "basic-query": {
        "result": [
          {
            "id": "http://n2t.net/ark:/99152/p0fp7wvjvn8",
            "name": "Northern Song [China, China: 0960 to 1127]",
            "type": [
              {
                "id": "http://www.w3.org/2004/02/skos/core#Concept",
                "name": "Period definition"
              }
            ],
            "score": 0,
            "match": true
          }
        ]
      },
      "limited-query": {
        "result": [
          {
            "id": "http://n2t.net/ark:/99152/p0z3skmnss7",
            "name": "Bronze [Palestine, Israel, Jordan: -3299 to -1199]",
            "type": [
              {
                "id": "http://www.w3.org/2004/02/skos/core#Concept",
                "name": "Period definition"
              }
            ],
            "score": 0,
            "match": false
          }
        ]
      },
      "additional-properties-query": {
        "result": [
          {
            "id": "http://n2t.net/ark:/99152/p06v8w4dbcf",
            "name": "Ранньоримський період [Ukraine, Ukraine: -0049 to 0175]",
            "type": [
              {
                "id": "http://www.w3.org/2004/02/skos/core#Concept",
                "name": "Period definition"
              }
            ],
            "score": 0,
            "match": true
          }
        ]
      }
    }
    ```

* __Error response__

  * __Status code__
  
    `400 Bad Request`

    __Body content__
    
    A `400` error indicates that the value of `queries` could not be parsed:
    
    `malformed queries`
    
* __Sample call__

  ```
  curl http://localhost:8142/ \
      --get \
      --data-urlencode 'queries={"basic-query":{"query":"北宋"},"limited-query":{"query":"bronze age","limit":1},"additional-properties-query":{"query":"Ранньоримський","properties":[{"p":"location","v":"Ukraine"},{"p":"start","v":"-0050"},{"p":"stop","v":"0175"}]}}'
  ```


----
### Reconcile period names (using `POST`)

If you are reconciling a large number of period names at once, you may
need to send a `POST` request rather than a [`GET` request](#reconcile-period-names-using-get).

* __URL path__

  `/`

* __Method__

  `POST`
  
* __Data__

  _Required_
  
  `queries=[JSON object literal]`
  
  The form of the JSON object literal is as specified above for a [`GET` request](#reconcile-period-names-using-get).

  _Optional_
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Success Response__

  * __Code__
  
    `200 OK`

    __Content__
    
    Same as for a successful [`GET` request](#reconcile-period-names-using-get).
    

* __Error Response__

  * __Code__
  
    `400 Bad Request`

    __Content__
    
    A `400` error indicates that the value of `queries` could not be parsed:
    
    `malformed queries`
    
* __Sample Call:__

  ```
  curl http://localhost:8142/ \
      --data-urlencode 'queries={"basic-query":{"query":"北宋"},"limited-query":{"query":"bronze age","limit":1},"additional-properties-query":{"query":"Ранньоримський","properties":[{"p":"location","v":"Ukraine"},{"p":"start","v":"-0050"},{"p":"stop","v":"0175"}]}}'
  ```


----
### Suggest property names

Fetch a list of names of additional properties (such as location) that
can be specified when reconciling period names.

* __URL path__

  `/suggest/properties`

* __Method__

  `GET`
  
* __Query parameters__

  _Required_
  
  none

  _Optional_
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Successful response__

  * __Status code__
  
    `200 OK`

    __Body content__

    ```json
    {
      "code": "/api/status/ok",
      "status": "200 OK",
      "result": [
        {
          "id": "location",
          "name": "Spatial coverage"
        },
        {
          "id": "start",
          "name": "Year or start year"
        },
        {
          "id": "stop",
          "name": "End year"
        }
      ]
    }
    ```

* __Sample call__

  ```
  curl http://localhost:8142/suggest/properties
  ```


----
### Suggest period definitions

Given a specified sequence of characters, fetch a list of period
definitions with labels containing that sequence. Intended to be used
for auto-suggesting input fields.

* __URL path__

  `/suggest/entities`

* __Method__

  `GET`
  
* __Query parameters__

  _Required_
  
  `prefix=[character sequence]`

  _Optional_
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Successful response__

  * __Status code__
  
    `200 OK`

    __Body content__

    ```json
    {
      "code": "/api/status/ok",
      "status": "200 OK",
      "result": [
        {
          "id": "http://n2t.net/ark:/99152/p06v8w4nfqg",
          "name": "Bashkëkohore [Albania, Albania: 1944 to 2000]",
          "type": [
            {
              "id": "http://www.w3.org/2004/02/skos/core#Concept",
              "name": "Period definition"
            }
          ],
          "score": 0,
          "match": false
        },
        {
          "id": "http://n2t.net/ark:/99152/p0qhb662s6j",
          "name": "Bashkëkohore [Albania, Albania: 1944 to 2000]",
          "type": [
            {
              "id": "http://www.w3.org/2004/02/skos/core#Concept",
              "name": "Period definition"
            }
          ],
          "score": 0,
          "match": false
        }
      ]
    }
    ```

* __Sample call__

  ```
  curl http://localhost:8142/suggest/entities?prefix=bashkekohore
  ```


----
### Preview period definition details

* __URL path__

  `/preview`

* __Method__

  `GET`
  
* __Query parameters__

  _Required_ 
  
  `id=[period definition identifier]`

  _Optional_
  
  `flyout=true`
  send HTML as the value of a JSON object with a single `html` property
 
  `callback=[function name]`
  specify callback function for [JSONP](https://en.wikipedia.org/wiki/JSONP) requests

* __Successful response__


  * __Status code__
  
    `200 OK`
    
    __Body content__
    
    ```html
    <!doctype html>
    <html>
    <body bgcolor="white">
    <style>
      dl {
        font-family: sans-serif;
        font-size: 13px !important;
        margin: 0.5em !important;
      }
      dh { color: #93a1a1 }
      dd {
        margin-bottom: 1em !important;
        margin-left: 1em !important;
      }
      p { margin: 0.5em 0; font-size: 13px !important; }
      a { color: #4272db; text-decoration: none }
    </style>
    <dl>
      <dh>Period</dh>
      <dd>
        <p><a target="_blank" href="http://n2t.net/ark:/99152/p0fp7wvjvn8">Northern Song</a></p>
        <p><i>北宋, Beisong, 北宋</i></p>
      </dd>

      <dh>Source</dh>
      <dd>
        <p>
          <a target="_blank"
             href="http://n2t.net/ark:/99152/p0fp7wv">Merrick Lex Berman. CHGIS: Major Chinese Periods Chronology. 2015.</a>
        </p>
        <p>
          <i>contains 52 period definitions</i>
        </p>
      </dd>

      <dh>Earliest start</dh>
      <dd>
        <p>960</p>
        <p><i>ISO year 960</i></p>
      </dd>

      <dh>Latest stop</dh>
      <dd>
        <p>1127</p>
        <p><i>ISO year 1127</i></p>
      </dd>

      <dh>Spatial coverage</dh>
      <dd>
        <p>China</p>
        <p><i>China</i></p>
        </p>
      </dd>
    </dl>
    ```

* __Error Response__

  * __Code__
  
    `404 Not Found`

    __Content__
    
    A `404` error indicates that the value of `id` does not identify
    a period definition:
    
    `'foo' is not a period definition URI`
    
* __Sample Call:__

  ```
  curl http://localhost:8142/preview?id=http://n2t.net/ark:/99152/p0fp7wvjvn8
  ```
