function buildChart(elementId, title, vAxisName, vAxisOptions, entries) {
  const element = document.getElementById(elementId);

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Time');
  dataTable.addColumn('number', vAxisName);
  dataTable.addRows(entries);

  const options = {
    hAxis: {
      format: 'HH:mm'
    },
    height: 500,
    title,
    vAxis: vAxisOptions,
    chartArea: {left: 100},
    width: 900,
  };

  const chart = new google.visualization.LineChart(element);
  chart.draw(dataTable, options);
}

function createDateFromString(str) {
  const date = new Date(`${str} UTC`).getTime();
  return new Date(date + 36e5);
}
