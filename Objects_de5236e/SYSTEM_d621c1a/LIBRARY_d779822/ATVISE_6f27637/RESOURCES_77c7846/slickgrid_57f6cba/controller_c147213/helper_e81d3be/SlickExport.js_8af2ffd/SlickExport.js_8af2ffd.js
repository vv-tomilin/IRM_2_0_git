/**
 * Utility class for exports (e.g. csv)
 * @param {object} dataView rever to slick grid
 * @param {object} grid revers to slick grid
 * @param {object} columns revers to column configuration see SlickController
 * @private
 * @constructor
 */
function SlickExport(dataView, grid, columns) {

    var ignoreFieldsInExport = [
        "atvise_expand",
        "atvise_marker",
    ];


    /**
     * Process table data into the csv format and download it.
     * @param {object} options
     * @param {boolean} options.includeHidden
     * @param {boolean} options.onlyMarked
     */
    this.exportAsCSV = function (options) {
        var selectedIndexes = grid.getSelectedRows();
        var availableColumns = grid.getColumns();
        if (typeof options != "undefined" && typeof options.includeHidden != "undefined" && options.includeHidden == true) {
            availableColumns = columns;
        }

        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null || row[j] === undefined ? '' : row[j].toString();
                if (innerValue.indexOf('table-icon') > -1)
                    innerValue = "selected";

                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|;|\n)/g) >= 0)
                    result = "'" + result + "'";
                if (j > 0)
                    finalVal += ';';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        var rows = [];
        var columnNames = [];

        for (var j = 0, len = availableColumns.length; j < len; j++) {
            if (ignoreFieldsInExport.indexOf(availableColumns[j].field) == -1) {
                columnNames.push(availableColumns[j].name);
            }
        }
        rows.push(columnNames);

        for (var i = 0, l = dataView.getLength(); i < l; i++) {
            var currentRow = [];
            var dataItem = grid.getDataItem(i);
            var isSelected = false;
            for (var j = 0, len = availableColumns.length; j < len; j++) {
                var fieldName = availableColumns[j].field;
                if (ignoreFieldsInExport.indexOf(fieldName) == -1) {
                    if (fieldName == "atvise_marker") {
                        if (selectedIndexes.indexOf(i) > -1) {
                            currentRow.push("true");
                            isSelected = true;
                        } else {
                            currentRow.push("");
                        }
                    } else {
                        currentRow.push(dataItem[fieldName]);
                    }
                } else {
                    if (fieldName == "atvise_marker" && selectedIndexes.indexOf(i) > -1) {
                        isSelected = true;
                    }
                }
            }
            if (!(typeof options != "undefined" && typeof options.onlyMarked != "undefined" && options.onlyMarked == true && !isSelected)) {
                rows.push(currentRow);
            }
        }

        var utc = new Date().toJSON().slice(0, 19).replace(/-/g, '/');

        csvFile = processRow(["export", utc]);
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var fileName = "export_" + utc + ".csv";
        _downloadFile(fileName, csvFile);
    };

    /**
     * Trigger a file download from within the client.
     * @param {string} fileName
     * @param {string} content
     * @private
     */
    function _downloadFile(fileName, content) {

        if (webMI.isMobileTouchDevice()) {
            return; //downloads are not possible on mobile devices
        }

        var blob = new Blob([content], {type: "text/csv"}),
            url = window.URL.createObjectURL(blob);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            var tempLinkEl = document.createElement("a");
            tempLinkEl.style = "display: none";
            document.body.appendChild(tempLinkEl);
            tempLinkEl.href = url;
            tempLinkEl.download = fileName;
            tempLinkEl.click();
            tempLinkEl.remove();
            window.URL.revokeObjectURL(url);
        }
    }

}