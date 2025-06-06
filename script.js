
let autoRotateInterval = null;
const REFRESH_INTERVAL = 60 * 60 * 1000; // 60 minutes

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFTq55DYn8TQUc77177b9DPFtW0cVXaghE59MBP3IBSM0OUYzAPsLmKseMqAVJw/pubhtml';

function loadHonourBoardFromSheets() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    simpleSheet: true,
    callback: function(data) {
      buildTable(data);
    }
  });
}

function buildTable(data) {
  const container = document.getElementById('tableContainer');
  container.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Define the header
  const headerRow = document.createElement('tr');
  ['DATE', 'PRESIDENT', 'SECRETARY', 'TREASURER'].forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Add rows
  data.forEach(row => {
    const tr = document.createElement('tr');
    ['DATE', 'PRESIDENT', 'SECRETARY', 'TREASURER'].forEach(col => {
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

  loadHonourBoardFromSheets();
  
  // Auto-refresh the data every 60 minutes
  setInterval(loadHonourBoardFromSheets, REFRESH_INTERVAL);
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
