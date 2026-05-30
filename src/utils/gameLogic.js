// lodash import removed 
// Actually, I'll write vanilla JS helpers to avoid extra deps for now, or use what I have.

// Level 1 Content: Equivalent Infinitesimals (x -> 0)
export const EQUIVALENCE_CLASSES = {
  'x': [
    'x',
    '\\sin x',
    '\\tan x',
    '\\arcsin x',
    '\\arctan x',
    'e^x - 1',
    '\\ln(1+x)'
  ],
  '2x': [
    '2x',
    '\\sin(2x)',
    '\\tan(2x)',
    'e^{2x} - 1',
    '\\ln(1+2x)'
  ],
  'half_x_sq': [
    '\\frac{1}{2}x^2',
    '1 - \\cos x'
  ],
  'x_sq': [
    'x^2',
    '2(1 - \\cos x)',
    '\\sin^2 x'
  ]
};

// Helper to get a random item from an array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a grid of tiles.
 * @param {number} rows 
 * @param {number} cols 
 * @returns {Array<Array<Object>>} 2D array of tile objects
 */
export const generateGrid = (rows, cols) => {
  const totalTiles = rows * cols;
  if (totalTiles % 2 !== 0) {
    throw new Error("Grid size must be even");
  }

  const pairsCount = totalTiles / 2;
  const tiles = [];

  // Generate pairs
  for (let i = 0; i < pairsCount; i++) {
    // Pick a random class
    const classKeys = Object.keys(EQUIVALENCE_CLASSES);
    const randomClassKey = randomChoice(classKeys);
    const expressions = EQUIVALENCE_CLASSES[randomClassKey];

    // Pick two expressions from this class (can be the same)
    const expr1 = randomChoice(expressions);
    const expr2 = randomChoice(expressions);

    tiles.push({ id: `tile-${i}-a`, content: expr1, classKey: randomClassKey, status: 'idle' });
    tiles.push({ id: `tile-${i}-b`, content: expr2, classKey: randomClassKey, status: 'idle' });
  }

  // Shuffle tiles
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Place into grid
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        ...tiles[r * cols + c],
        row: r,
        col: c
      });
    }
    grid.push(row);
  }

  return grid;
};

/**
 * Checks if two tiles match.
 */
export const checkMatch = (tile1, tile2) => {
  if (!tile1 || !tile2) return false;
  if (tile1.id === tile2.id) return false;
  return tile1.classKey === tile2.classKey;
};

/**
 * Pathfinding for Lianliankan (max 2 turns).
 * The search includes a one-tile virtual border so edge pairs can connect
 * through the outside path, which is expected in classic Lianliankan rules.
 * @param {Array<Array<Object>>} grid
 * @param {Object} start {row, col}
 * @param {Object} end {row, col}
 * @returns {Array<{row, col}> | null} Path as array of coordinates, or null if no path.
 */
export const findPath = (grid, start, end) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];

  const queue = [{
    row: start.row,
    col: start.col,
    turns: 0,
    lastDir: -1,
    path: [start]
  }];

  const visited = new Map();
  const getVisKey = (r, c, dir) => `${r},${c},${dir}`;

  while (queue.length > 0) {
    const { row, col, turns, lastDir, path } = queue.shift();

    for (let i = 0; i < directions.length; i++) {
      const nextR = row + directions[i].dr;
      const nextC = col + directions[i].dc;
      const newTurns = lastDir !== -1 && lastDir !== i ? turns + 1 : turns;

      if (newTurns > 2) continue;
      if (!isWithinSearchArea(nextR, nextC, rows, cols)) continue;
      if (!isPassable(grid, nextR, nextC, start, end)) continue;

      if (nextR === end.row && nextC === end.col) {
        return [...path, end];
      }

      const key = getVisKey(nextR, nextC, i);
      if (visited.has(key) && visited.get(key) <= newTurns) continue;

      visited.set(key, newTurns);
      queue.push({
        row: nextR,
        col: nextC,
        turns: newTurns,
        lastDir: i,
        path: [...path, { row: nextR, col: nextC }]
      });
    }
  }

  return null;
};

const isWithinSearchArea = (r, c, rows, cols) => {
  return r >= -1 && r <= rows && c >= -1 && c <= cols;
};

const isPassable = (grid, r, c, start, end) => {
  if (r === start.row && c === start.col) return true;
  if (r === end.row && c === end.col) return true;
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return true;

  return grid[r][c].status === 'matched';
};
