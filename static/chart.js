function getData(endpoint, limit = 10000) {
  return fetch(`/data/${endpoint}/?limit=${limit}`).then(response => response.json());
}

function buildOptions(title, format) {
  return {
    allowAsync: true,
    chartArea: {left: 100},
    height: 500,
    title,
    vAxis: {format},
    width: 900,
  };
}

function buildChart(elementId) {
  const element = document.getElementById(elementId);
  return new google.visualization.LineChart(element);
}

function buildDataTable(vAxisName, entries) {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Time');
  dataTable.addColumn('number', vAxisName);
  dataTable.addRows(entries);

  return dataTable;
}
