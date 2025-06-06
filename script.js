
const REFRESH_INTERVAL = 60 * 60 * 1000; // 60 minutes

const sheets = [
  { title: 'Honour Roll', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFTq55DYn8TQUc77177b9DPFtW0cVXaghE59MBP3IBSM0OUYzAPsLmKseMqAVJw/pub?gid=601913881&single=true&output=csv' },
  { title: 'Life Member', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFTq55DYn8TQUc77177b9DPFtW0cVXaghE59MBP3IBSM0OUYzAPsLmKseMqAVJw/pub?output=csv' },
  { title: 'Best and Fairest', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFTq55DYn8TQUc77177b9DPFtW0cVXaghE59MBP3IBSM0OUYzAPsLmKseMqAVJw/pub?gid=1412386410&single=true&output=csv' },
  { title: 'Club Awards', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFTq55DYn8TQUc77177b9DPFtW0cVXaghE59MBP3IBSM0OUYzAPsLmKseMqAVJw/pub?gid=617843838&single=true&output=csv' }
];

function loadAllSheets() {
  const promises = sheets.map(sheet => fetchSheet(sheet));
  Promise.all(promises).then(() => {
    console.log('All sheets loaded');
  });
}

function fetchSheet(sheet) {
  return new Promise((resolve) => {
    Papa.parse(sheet.url, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        buildTable(results.meta.fields, results.data);
        resolve();
      }
    });
  });
}

function buildTable(headers, data) {
  const container = document.getElementById('tableContainer');

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  if (headers.length === 0) return;

  const headerRow = document.createElement('tr');
  headers.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col] || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function startHonourBoard() {
  const startOverlay = document.getElementById('startOverlay');
  startOverlay.style.display = 'none';

  document.getElementById('honourBoardContainer').style.display = 'block';

  enterFullscreen();

  loadAllSheets();

  // Auto-refresh the data every 60 minutes
  setInterval(() => {
    document.getElementById('tableContainer').innerHTML = '';
    loadAllSheets();
  }, REFRESH_INTERVAL);
}

function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

document.getElementById('startButton').addEventListener('click', startHonourBoard);
