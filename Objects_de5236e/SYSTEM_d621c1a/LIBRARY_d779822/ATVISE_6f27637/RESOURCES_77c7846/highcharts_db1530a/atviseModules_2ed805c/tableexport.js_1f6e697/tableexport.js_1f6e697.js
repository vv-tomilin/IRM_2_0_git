((function (H) {

	H.getOptions().exporting.menuItemDefinitions.downloadXLSX = {
		textKey: "downloadXLSX", onclick: function () {

			var div = document.createElement('div');
			div.style.display = 'none';
			document.body.appendChild(div);
			div.innerHTML = this.getTable();

			TableExport(div, {
				formats: ['xlsx'],
				filename: "export_" + exportTime("_")
			});
			document.querySelector('.button-default.xlsx').click();
		}
	};

	H.getOptions().lang.downloadXLSX = 'Download XLSX';


	var exportTime = function (sp) {
		today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //As January is 0.
		var yyyy = today.getFullYear();
		var hr = today.getHours();
		var mn = today.getMinutes();
		var se = today.getSeconds();

		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		if (hr < 10) hr = '0' + hr;
		if (mn < 10) mn = '0' + mn;
		if (se < 10) se = '0' + se;

		return (yyyy + sp + mm + sp + dd + sp + hr + mn + se);
	};

	TableExport.prototype.types.date = {
		defaultClass: 'tableexport-date',
		assert: function (v) {
			return false; // Never export as date, because it would be a timestamp and shown as the UTC date in Excel
		}
	}

})(Highcharts));