## Open Refine reconciliation service for PeriodO data

Before you begin, make sure [Node.js version 8 or higher](https://nodejs.org/en/download/current/) and [OpenRefine](http://openrefine.org/download.html) are installed on your machine.

The commands below must be typed into a terminal window.

1. Install the reconciler:

    ```
    npm install -g periodo-reconciler
    ```

1. Download [the PeriodO data](http://n2t.net/ark:/99152/p0d.json) (or some subset that you want to reconcile against) and put it somewhere.

1. Run the reconciliation server, giving it the path to where you put the PeriodO data:

    ```
    periodo-reconciler some/path/to/p0d.json
    ```

1. You should see:

    ```
    Reconciling against some/path/p0d.json
    Reconciliation server running on http://localhost:8142
    ```

1. Now open OpenRefine.

1. **Create Project > Choose Files** and choose your CSV file.

1. **Next > Create Project** to finish creating the project.

1. Click on the down arrow in the header of the column you want to reconcile (the column with period names) and choose **Reconcile > Start Reconciling**.

1. You should see a modal dialog. Click **Add Standard Service** at the bottom.

1. Enter the url `http://localhost:8142` and click **Add Service**.

1. You should now see **PeriodO reconciliation service** selected under **Services** on the left. Click the tag icon next to **Services** to close this drawer.

1. Under where it says **Also use relevant details from other columns** you can optionally choose columns that have location names, start years, or end years for further constraining your reconciliation queries. For example, if you had place names in a column named `Place`, you would click the checkbox next to **Place** and also enter the text `Spatial coverage` in the (autocompleting) text input next to the checkbox.

1. Click **Start Reconciling**.

## How reconciliation works

To reconcile a period term against PeriodO data, one needs

1. the period term, e.g. `Late Cypriot III`,
1. (optionally) a place name, e.g. `Cyprus`, and
1. (optionally) a single number denoting a Gregorian calendar year, e.g. `-1200`, or a pair of such numbers delimiting an interval, e.g. `-1200` to `-1050`.

Each of these pieces of data (if provided) is then reconciled against the appropriate fields of PeriodO period definitions. Each reconciliation (terminological, spatial, and temporal) produces a ranked list of matching periods. These ranked lists are then combined by taking their intersection, and combining the rankings using the [Schulze method](https://en.wikipedia.org/wiki/Schulze_method).

### Matching period terms against periods' labels

The period term is matched against the [preferred and alternate labels](http://perio.do/technical-overview/#labels-and-documentation) of each period definition. If there are multiple tokens in the term (e.g. `Late Cypriot III` has three tokens), *any* of the tokens can match (i.e. it is a Boolean `OR` query). Period definitions with matches in the preferred label are ranked higher than ones with matches in the alternate labels.

### Matching place names against periods' spatial coverages

The place name (if provided) is matched against the [spatial coverage description and linked spatial entity labels](http://perio.do/technical-overview/#spatial-extent) of each period definition. If there are multiple tokens in the place name, *any* of the tokens can match (i.e. it is a Boolean `OR` query).

### Matching years or year ranges again periods' temporal extents

The year or year range (if provided) is matched again the [temporal extent](http://perio.do/technical-overview/#temporal-extent) of each period definition. Single years match if they fall within the widest temporal extent for the period, plus one century on either side. Year ranges match to the extent that they overlap with the widest temporal extent for the period, plus one century on either side.
