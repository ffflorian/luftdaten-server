function buildChart(elementId, title, vAxisName, vAxisOptions, entries) {
  const element = document.getElementById(elementId);

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Time');
  dataTable.addColumn('number', vAxisName);
  dataTable.addRows(entries);

  const options = {
    height: 500,
    title,
    vAxis: vAxisOptions,
    chartArea: {left: 50},
    width: 900,
  };

  const chart = new google.visualization.LineChart(element);
  chart.draw(dataTable, options);
}
