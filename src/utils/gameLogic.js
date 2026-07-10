import { LEVELS } from '../data/levels.js';

// Default level used when none is specified
const DEFAULT_LEVEL_ID = 'infinitesimals';

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Get the group definitions for a level.
 */
export function getLevelGroups(levelId = DEFAULT_LEVEL_ID) {
  const level = LEVELS[levelId] || LEVELS[DEFAULT_LEVEL_ID];
  return level.groups;
}

/**
 * Generates a grid of tiles for the given level.
 * @param {number} rows
 * @param {number} cols
 * @param {string} levelId
 * @param {string} difficulty - 'easy' | 'normal' | 'hard'
 * @returns {Array<Array<Object>>} 2D array of tile objects
 */
export const generateGrid = (rows, cols, levelId = DEFAULT_LEVEL_ID, difficulty = 'normal') => {
  const totalTiles = rows * cols;
  if (totalTiles % 2 !== 0) {
    throw new Error("Grid size must be even");
  }

  const level = LEVELS[levelId] || LEVELS[DEFAULT_LEVEL_ID];
  const allGroups = Object.values(level.groups);

  // Select groups based on difficulty
  let selectedGroups = allGroups;
  if (difficulty === 'easy') {
    selectedGroups = allGroups.slice(0, Math.min(3, allGroups.length));
  } else if (difficulty === 'hard') {
    selectedGroups = allGroups;
  } else {
    selectedGroups = allGroups.slice(0, Math.min(5, allGroups.length));
  }

  const pairsCount = totalTiles / 2;
  const tiles = [];

  for (let i = 0; i < pairsCount; i++) {
    const group = randomChoice(selectedGroups);
    const expr1 = randomChoice(group.expressions);
    const expr2 = randomChoice(group.expressions);

    tiles.push({
      id: `tile-${i}-a`,
      content: expr1,
      classKey: group.id,
      familyColor: group.color,
      status: 'idle'
    });
    tiles.push({
      id: `tile-${i}-b`,
      content: expr2,
      classKey: group.id,
      familyColor: group.color,
      status: 'idle'
    });
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
 * Includes a one-tile virtual border so edge pairs can connect through the outside.
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

/**
 * Checks if the current grid has at least one valid move.
 * Used for solvability verification.
 */
export function hasAnyValidMove(grid) {
  const idleTiles = grid.flat().filter(t => t.status === 'idle');
  const byClass = {};

  idleTiles.forEach(t => {
    byClass[t.classKey] = byClass[t.classKey] || [];
    byClass[t.classKey].push(t);
  });

  for (const classKey of Object.keys(byClass)) {
    const tiles = byClass[classKey];
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        const path = findPath(
          grid,
          { row: tiles[i].row, col: tiles[i].col },
          { row: tiles[j].row, col: tiles[j].col }
        );
        if (path) return true;
      }
    }
  }

  return false;
}

/**
 * Generates a guaranteed solvable grid by reshuffling if needed.
 */
export function generateSolvableGrid(rows, cols, levelId = DEFAULT_LEVEL_ID, difficulty = 'normal', maxAttempts = 50) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid = generateGrid(rows, cols, levelId, difficulty);
    if (hasAnyValidMove(grid)) {
      return grid;
    }
  }

  // Fallback: reduce difficulty and try again
  if (difficulty === 'hard') {
    return generateSolvableGrid(rows, cols, levelId, 'normal', maxAttempts);
  }
  if (difficulty === 'normal') {
    return generateSolvableGrid(rows, cols, levelId, 'easy', maxAttempts);
  }

  throw new Error('Unable to generate a solvable grid');
}
