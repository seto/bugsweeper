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
};

const boardEl = document.getElementById('board');
const mineCountEl = document.getElementById('mine-count');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const overlay = document.getElementById('message-overlay');
const msgIcon = document.getElementById('msg-icon');
const msgTitle = document.getElementById('msg-title');
const msgSubtitle = document.getElementById('msg-subtitle');
const msgBtn = document.getElementById('msg-btn');

const footerMsg = document.querySelector('footer p');
if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
  footerMsg.textContent = 'Tap to commit · Long-press to open a PR';
} else {
  footerMsg.textContent = 'Left-click to commit · Right-click to open a PR';
}

const pad3 = (n) => String(Math.min(n, 999)).padStart(3, '0');

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
    ([nr, nc]) => nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols,
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

  [[safeR, safeC], ...neighbors(safeR, safeC)].forEach(([r, c]) =>
    safe.add(r * cols + c),
  );

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
        board[r][c].neighbors = neighbors(r, c).filter(
          ([nr, nc]) => board[nr][nc].mine,
        ).length;
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
  const flagCount = nbs.filter(
    ([nr, nc]) => state.board[nr][nc].flagged,
  ).length;

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
      `Merged in ${pad3(state.seconds)}s. Your repository is clean.`,
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
    `A critical issue was opened after ${pad3(state.seconds)}s. All bugs exposed.`,
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
    })),
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
    document
      .querySelectorAll('.diff-btn')
      .forEach((b) => b.classList.remove('active'));
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

newGame();
