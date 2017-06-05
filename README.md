# Open Refine reconciliation service for PeriodO data

Used for reconciliation:

* skos:prefLabel
* skos:altLabel
* time:intervalStartedBy
* time:intervalFinishedBy
* periodo:spatialCoverageDescription
* dcterms:spatial


# Starting
Requires Node 6+

```
npm install
npm update_dataset
npm start
```

The server will use port 8142.
