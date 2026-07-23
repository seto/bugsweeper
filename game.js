/**
 * =======================================================================
 * ___.
 * \_ |__  __ __  ____  ________  _  __ ____   ____ ______   ___________
 * | __ \|  |  \/ ___\/  ___/\ \/ \/ // __ \_/ __ \\____ \_/ __ \_  __ \
 * | \_\ \  |  / /_/  >___ \  \     /\  ___/\  ___/|  |_> >  ___/|  | \/
 * |___  /____/\___  /____  >  \/\_/  \___  >\___  >   __/ \___  >__|
 *     \/     /_____/     \/              \/     \/|__|        \/
 *
 * =======================================================================
 */

let state = {
  rows: 9,
  cols: 9,
  mines: 10,
  board: [],
  revealed: 0,
  flags: 0,
  gameOver: false,
  won: false,
  started: false,
  timerInterval: null,
  seconds: 0,
  showNumbers: false,
};

const SVG = {
  // Mine: Issue icon
  mine: `<svg class="cell-icon" viewBox="0 0 16 16" fill="#d1242f">
    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
  </svg>`,

  // Flag: Open PR icon
  flag: `<svg class="cell-icon" viewBox="0 0 16 16" fill="#58a6ff">
    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
  </svg>`,

  // Wrong Flag: X Circle icon
  wrong: `<svg class="cell-icon" viewBox="0 0 16 16" fill="#d1242f">
    <path d="M2.344 2.343h-.001a8 8 0 0 1 11.314 11.314A8.002 8.002 0 0 1 .234 10.089a8 8 0 0 1 2.11-7.746Zm1.06 10.253a6.5 6.5 0 1 0 9.108-9.275 6.5 6.5 0 0 0-9.108 9.275ZM6.03 4.97 8 6.94l1.97-1.97a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l1.97 1.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-1.97 1.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L6.94 8 4.97 6.03a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018Z"/>
  </svg>`,

  // Victory: Merge icon
  victory: `<svg class="cell-icon" viewBox="0 0 16 16" fill="#8250df">
    <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
  </svg>`,

  // Game Over: Closed PR icon
  gameOver: `<svg class="cell-icon" viewBox="0 0 16 16" fill="#d1242f">
    <path d="M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/>
  </svg>`,

  // Theme toggle icons
  moon: `<svg class="theme-icon" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z"/>
  </svg>`,

  sun: `<svg class="theme-icon" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z"/>
  </svg>`,

  // Numbers toggle icon
  numbers: `<svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M9 4.75A.75.75 0 0 1 9.75 4h4a.75.75 0 0 1 .53 1.28l-1.89 1.892c.312.076.604.18.867.319.742.391 1.244 1.063 1.244 2.005 0 .653-.231 1.208-.629 1.627-.386.408-.894.653-1.408.777-1.01.243-2.225.063-3.124-.527a.751.751 0 0 1 .822-1.254c.534.35 1.32.474 1.951.322.306-.073.53-.201.67-.349.129-.136.218-.32.218-.596 0-.308-.123-.509-.444-.678-.373-.197-.98-.318-1.806-.318a.75.75 0 0 1-.53-1.28l1.72-1.72H9.75A.75.75 0 0 1 9 4.75Zm-3.587 5.763c-.35-.05-.77.113-.983.572a.75.75 0 1 1-1.36-.632c.508-1.094 1.589-1.565 2.558-1.425 1 .145 1.872.945 1.872 2.222 0 1.433-1.088 2.192-1.79 2.681-.308.216-.571.397-.772.573H7a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75c0-.69.3-1.211.67-1.61.348-.372.8-.676 1.15-.92.8-.56 1.18-.904 1.18-1.474 0-.473-.267-.69-.587-.737ZM5.604.089A.75.75 0 0 1 6 .75v4.77h.711a.75.75 0 0 1 0 1.5H3.759a.75.75 0 0 1 0-1.5H4.5V2.15l-.334.223a.75.75 0 0 1-.832-1.248l1.5-1a.75.75 0 0 1 .77-.037Z"/>
  </svg>`,
};

const themeToggleBtn = document.getElementById('theme-toggle');
const numbersToggleBtn = document.getElementById('numbers-toggle');
const boardEl = document.getElementById('board');
const mineCountEl = document.getElementById('mine-count');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const overlay = document.getElementById('message-overlay');
const msgIcon = document.getElementById('msg-icon');
const msgTitle = document.getElementById('msg-title');
const msgSubtitle = document.getElementById('msg-subtitle');
const msgBtn = document.getElementById('msg-btn');
const msgClose = document.getElementById('msg-close');

const footerMsg = document.querySelector('footer p');
if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
  footerMsg.textContent = 'Tap to commit · Long-press to open a PR';
} else {
  footerMsg.textContent = 'Left-click to commit · Right-click to open a PR';
}

const pad3 = (n) => String(Math.min(n, 999)).padStart(3, '0');

function setTheme(theme) {
  document.documentElement.classList.toggle('light-theme', theme === 'light');
  if (theme === 'dark') {
    themeToggleBtn.innerHTML = SVG.sun;
  } else {
    themeToggleBtn.innerHTML = SVG.moon;
  }
}

/**
 * Enables or disables the display of mine counts on revealed cells.
 * Updates the visual state of the toggle button and re-renders all cells.
 */
function setNumbersDisplay(show) {
  state.showNumbers = show;
  numbersToggleBtn.classList.toggle('active', show);
  localStorage.setItem('showNumbers', show ? 'true' : 'false');

  // Re-render all cells if board is initialized
  if (state.board.length > 0) {
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        updateCellEl(r, c);
      }
    }
  }
}

/**
 * Returns coordinates of neighboring cells for a given cell.
 * Filters out neighbors that are out of bounds.
 */
function neighbors(r, c) {
  const DIRS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return DIRS.map(([dr, dc]) => [r + dr, c + dc]).filter(
    ([nr, nc]) => nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols
  );
}

/**
 * Randomly places mines on the board.
 * Avoids placing mines on the first clicked cell and its neighbors ensuring the
 * the opening move is always safe.
 */
function placeMines(safeR, safeC) {
  const { rows, cols, mines, board } = state;
  const safe = new Set();

  [[safeR, safeC], ...neighbors(safeR, safeC)].forEach(([r, c]) => safe.add(r * cols + c));

  let placed = 0;
  while (placed < mines) {
    const idx = Math.floor(Math.random() * rows * cols);
    if (!safe.has(idx)) {
      const r = Math.floor(idx / cols),
        c = idx % cols;
      if (!board[r][c].mine) {
        board[r][c].mine = true;
        placed++;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].mine) {
        board[r][c].neighbors = neighbors(r, c).filter(([nr, nc]) => board[nr][nc].mine).length;
      }
    }
  }
}

/**
 * Syncs the DOM element of a cell with its state.
 * Handles three visual states in order of priority: flagged, unrevealed, revealed.
 * The `revealed-N` class (capped at 4) drives the neighbor-count color via CSS.
 */
function updateCellEl(r, c) {
  const cell = state.board[r][c];
  const el = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  if (!el) return;

  el.className = 'cell';
  el.innerHTML = '';

  if (cell.flagged && !cell.revealed) {
    el.classList.add('flagged');
    el.innerHTML = SVG.flag;
    return;
  }

  if (!cell.revealed) {
    return;
  }

  if (cell.mine) {
    el.classList.add('revealed', 'mine-revealed');
    el.innerHTML = SVG.mine;
    return;
  }

  const n = cell.neighbors;
  el.classList.add('revealed', `revealed-${Math.min(n, 4)}`);

  if (state.showNumbers && n > 0) {
    el.innerHTML = `<span class="cell-number">${n}</span>`;
  }
}

/**
 * Updates the mine counter display.
 * Floors at 0 to avoid showing negative values when flags exceed mine count.
 */
function updateMineCount() {
  const remaining = state.mines - state.flags;
  mineCountEl.textContent = pad3(Math.max(remaining, 0));
}

/**
 * Cascade reveals cells.
 * If a cell has no mines around, propagates to its neighbors with a staggered
 * delay to animate the flood-fill visually.
 */
function reveal(r, c, cascade = false) {
  const { board, rows, cols } = state;
  const cell = board[r][c];

  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;
  state.revealed++;
  updateCellEl(r, c);

  if (cell.mine) {
    triggerGameOver(r, c);
    return;
  }

  if (cell.neighbors === 0) {
    neighbors(r, c).forEach(([nr, nc]) => {
      if (!board[nr][nc].revealed && !board[nr][nc].flagged) {
        setTimeout(() => reveal(nr, nc, true), cascade ? 10 : 0);
      }
    });
  }

  checkWin();
}

function toggleFlag(r, c) {
  const cell = state.board[r][c];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  state.flags += cell.flagged ? 1 : -1;
  updateCellEl(r, c);
  updateMineCount();

  if (!state.started) startGame(r, c);
}

/**
 * Chording move.
 * Reveals all unflagged neighbors if the flagged-neighbor count is equal to the
 * cell's neighbor count.
 */
function chord(r, c) {
  const cell = state.board[r][c];
  if (!cell.revealed || cell.mine) return;

  const nbs = neighbors(r, c);
  const flagCount = nbs.filter(([nr, nc]) => state.board[nr][nc].flagged).length;

  if (flagCount === cell.neighbors) {
    nbs.forEach(([nr, nc]) => {
      if (!state.board[nr][nc].flagged && !state.board[nr][nc].revealed) {
        reveal(nr, nc);
      }
    });
  }
}

/**
 * Checks if all non-mine cells have been revealed.
 * On win, auto-flags any unflagged mines before showing the overlay.
 */
function checkWin() {
  const { rows, cols, mines, revealed } = state;
  if (revealed === rows * cols - mines) {
    state.won = true;
    state.gameOver = true;
    clearInterval(state.timerInterval);
    state.timerInterval = null;

    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const cell = state.board[r][c];
        if (cell.mine && !cell.flagged) {
          cell.flagged = true;
          state.flags++;
          updateCellEl(r, c);
        }
      }
    }
    updateMineCount();

    showMessage(
      SVG.victory,
      'All bugs fixed!',
      `Merged in ${pad3(state.seconds)}s. Your repository is clean.`
    );
  }
}

/**
 * Ends the game on mine hit.
 * Reveals all mines and marks wrong flags.
 */
function triggerGameOver(explodedR, explodedC) {
  state.gameOver = true;
  clearInterval(state.timerInterval);
  state.timerInterval = null;

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = state.board[r][c];
      if (cell.mine) {
        cell.revealed = true;
        updateCellEl(r, c);
        if (r === explodedR && c === explodedC) {
          const el = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
          el.classList.add('mine-exploded');
        }
      } else if (cell.flagged && !cell.mine) {
        const el = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        el.classList.add('wrong-flag');
        el.innerHTML = SVG.wrong;
      }
    }
  }

  showMessage(
    SVG.gameOver,
    'Repository compromised!',
    `A critical issue was opened after ${pad3(state.seconds)}s. All bugs exposed.`
  );
}

function showMessage(icon, title, subtitle) {
  msgIcon.innerHTML = icon;
  msgTitle.textContent = title;
  msgSubtitle.textContent = subtitle;
  overlay.classList.remove('hidden');
}

function startGame(r, c) {
  state.started = true;
  placeMines(r, c);
  state.timerInterval = setInterval(() => {
    state.seconds++;
    timerEl.textContent = pad3(state.seconds);
  }, 1000);
}

function newGame() {
  overlay.classList.add('hidden');

  clearInterval(state.timerInterval);
  state.timerInterval = null;

  state.board = Array.from({ length: state.rows }, () =>
    Array.from({ length: state.cols }, () => ({
      mine: false,
      neighbors: 0,
      revealed: false,
      flagged: false,
    }))
  );

  state.revealed = 0;
  state.flags = 0;
  state.gameOver = false;
  state.won = false;
  state.started = false;
  state.seconds = 0;

  timerEl.textContent = '000';

  updateMineCount();

  boardEl.style.gridTemplateColumns = `repeat(${state.cols}, var(--cell-size))`;
  boardEl.innerHTML = '';
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.r = r;
      el.dataset.c = c;
      el.setAttribute('role', 'gridcell');
      boardEl.appendChild(el);
    }
  }
}

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme')) return;
  setTheme(e.matches ? 'light' : 'dark');
});

themeToggleBtn.addEventListener('click', () => {
  const isLight = document.documentElement.classList.contains('light-theme');
  setTheme(isLight ? 'dark' : 'light');
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
});

boardEl.addEventListener('click', (e) => {
  const el = e.target.closest('.cell');
  if (!el || state.gameOver) return;

  const r = +el.dataset.r,
    c = +el.dataset.c;
  const cell = state.board[r][c];

  if (cell.flagged) return;

  if (cell.revealed) {
    chord(r, c);
    return;
  }

  if (!state.started) startGame(r, c);

  reveal(r, c);
});

boardEl.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const el = e.target.closest('.cell');
  if (!el || state.gameOver) return;
  toggleFlag(+el.dataset.r, +el.dataset.c);
});

let longPressTimer = null;

boardEl.addEventListener('touchstart', (e) => {
  const el = e.target.closest('.cell');
  if (!el || state.gameOver) return;

  longPressTimer = setTimeout(() => {
    e.preventDefault();
    toggleFlag(+el.dataset.r, +el.dataset.c);
  }, 500);
});

boardEl.addEventListener('touchend', () => {
  clearTimeout(longPressTimer);
  longPressTimer = null;
});

boardEl.addEventListener('touchmove', () => {
  clearTimeout(longPressTimer);
  longPressTimer = null;
});

document.querySelectorAll('.diff-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const diff = btn.dataset.difficulty;
    if (diff == 'beginner') {
      state.rows = 9;
      state.cols = 9;
      state.mines = 10;
    } else if (diff == 'intermediate') {
      state.rows = 16;
      state.cols = 16;
      state.mines = 40;
    } else if (diff == 'expert') {
      const isWide = window.innerWidth >= 560;
      state.rows = isWide ? 16 : 30;
      state.cols = isWide ? 30 : 16;
      state.mines = 99;
    }

    newGame();
  });
});

resetBtn.addEventListener('click', newGame);

msgBtn.addEventListener('click', newGame);

msgClose.addEventListener('click', () => overlay.classList.add('hidden'));

numbersToggleBtn.addEventListener('click', () => {
  setNumbersDisplay(!state.showNumbers);
});

const isThemeSaved = localStorage.getItem('theme');
const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;

setTheme(isThemeSaved ?? (isSystemLight ? 'light' : 'dark'));

const isNumbersSaved = localStorage.getItem('showNumbers') === 'true';
setNumbersDisplay(isNumbersSaved);

numbersToggleBtn.innerHTML = SVG.numbers;

newGame();
