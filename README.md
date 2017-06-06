# Open Refine reconciliation service for PeriodO data

Before you begin, make sure [Node.js](https://nodejs.org) and [OpenRefine](http://openrefine.org/) are installed on your machine.

The commands below must be typed into a terminal window.

0. Install the reconciler:

    ```
    npm install -g periodo-reconciler
    ```

0. Download [the PeriodO data](http://n2t.net/ark:/99152/p0d.json) (or some subset that you want to reconcile against) and put it somewhere.

0. Run the reconciliation server, giving it the path to where you put the PeriodO data:

    ```
    periodo-reconciler some/path/to/p0d.json
    ```

0. You should see:

    ```
    Reconciling against some/path/p0d.json
    Reconciliation server running on http://localhost:8142
    ```

0. Now open OpenRefine.

0. **Create Project > Choose Files** and choose your CSV file.

0. **Next > Create Project** to finish creating the project.

0. Click on the down arrow in the header of the column you want to reconcile (the column with period names) and choose **Reconcile > Start Reconciling**.

0. You should see a modal dialog. Click **Add Standard Service** at the bottom.

0. Enter the url `http://localhost:8142` and click **Add Service**.

0. You should now see **PeriodO reconciliation service** selected under **Services** on the left. Click the tag icon next to **Services** to close this drawer.

0. Under where it says **Also use relevant details from other columns** you can optionally choose columns that have location names, start years, or end years for further constraining your reconciliation queries. For example, if you had place names in a column named `Place`, you would click the checkbox next to **Place** and also enter the text `Spatial coverage` in the (autocompleting) text input next to the checkbox.

0. Click **Start Reconciling**.
