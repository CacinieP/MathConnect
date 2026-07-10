import { checkMatch, findPath, generateGrid, hasAnyValidMove, generateSolvableGrid } from './src/utils/gameLogic.js';
import { LEVELS } from './src/data/levels.js';

console.log("Starting Game Logic Verification...");

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
    if (condition) {
        console.log(`PASS: ${message}`);
        passed++;
    } else {
        console.error(`FAIL: ${message}`);
        failed++;
    }
};

console.log("\n--- Verifying Equivalence Classes ---");
const tileX = { id: '1', content: 'x', classKey: 'x' };
const tileSinX = { id: '2', content: '\\sin x', classKey: 'x' };
const tile2x = { id: '3', content: '2x', classKey: 'two_x' };
const tileSin2x = { id: '4', content: '\\sin(2x)', classKey: 'two_x' };

assert(checkMatch(tileX, tileSinX) === true, "x should match sin(x)");
assert(checkMatch(tile2x, tileSin2x) === true, "2x should match sin(2x)");
assert(checkMatch(tileX, tile2x) === false, "x should NOT match 2x");
assert(checkMatch(tileX, tileX) === false, "Tile should not match itself by ID");

console.log("\n--- Verifying Levels Data ---");
assert(Object.keys(LEVELS).length === 7, "There should be 7 levels");
assert(LEVELS.infinitesimals.groups.x.expressions.includes('\\sin x'), "Infinitesimals level should include sin x");
assert(LEVELS.derivatives.groups.derivative_sin.expressions.includes('\\cos x'), "Derivatives level should include cos x");

console.log("\n--- Verifying Grid Generation ---");
try {
    const grid = generateGrid(4, 4);
    assert(grid.length === 4 && grid[0].length === 4, "Grid dimensions should be 4x4");

    const counts = {};
    grid.flat().forEach(tile => {
        counts[tile.classKey] = (counts[tile.classKey] || 0) + 1;
    });

    const allEven = Object.values(counts).every(count => count % 2 === 0);
    assert(allEven, "All classes should have an even number of tiles");

    const allHaveFamilyColor = grid.flat().every(t => t.familyColor);
    assert(allHaveFamilyColor, "All tiles should have a familyColor");
} catch (e) {
    console.error("Grid generation failed", e);
    failed++;
}

console.log("\n--- Verifying Solvability ---");
try {
    const solvableGrid = generateSolvableGrid(6, 10);
    assert(hasAnyValidMove(solvableGrid) === true, "Solvable grid should have at least one valid move");
} catch (e) {
    console.error("Solvability check failed", e);
    failed++;
}

console.log("\n--- Verifying Pathfinding ---");
const start = { row: 0, col: 0 };
const end = { row: 0, col: 2 };

const straightGrid = [
    [{ status: 'idle' }, { status: 'matched' }, { status: 'idle' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }]
];

const path1 = findPath(straightGrid, start, end);
assert(path1 !== null, "Should find straight path through empty space");

const uTurnGrid = [
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }]
];

const path2 = findPath(uTurnGrid, start, end);
assert(path2 !== null, "Should find U-shaped path with two turns");

const blockedStart = { row: 1, col: 1 };
const blockedEnd = { row: 1, col: 3 };
const blockedGrid = [
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }, { status: 'idle' }]
];

const path3 = findPath(blockedGrid, blockedStart, blockedEnd);
assert(path3 === null, "Should NOT find path when the start is blocked");

const outsideEdgeGrid = [
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }]
];

const path4 = findPath(outsideEdgeGrid, start, end);
assert(path4 !== null, "Should find outside-edge path for boundary tiles");

console.log(`\nVerification Complete: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
