import { checkMatch, findPath, generateGrid, EQUIVALENCE_CLASSES } from './src/utils/gameLogic.js';

console.log("Starting Game Logic Verification...");

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
    }
};

// 1. Verify Equivalence Classes
console.log("\n--- Verifying Equivalence Classes ---");
const tileX = { id: '1', content: 'x', classKey: 'x' };
const tileSinX = { id: '2', content: '\\sin x', classKey: 'x' };
const tile2x = { id: '3', content: '2x', classKey: '2x' };
const tileSin2x = { id: '4', content: '\\sin(2x)', classKey: '2x' };

assert(checkMatch(tileX, tileSinX) === true, "x should match sin(x)");
assert(checkMatch(tile2x, tileSin2x) === true, "2x should match sin(2x)");
assert(checkMatch(tileX, tile2x) === false, "x should NOT match 2x");
assert(checkMatch(tileX, tileX) === false, "Tile should not match itself (by ID)");

// 2. Verify Grid Generation
console.log("\n--- Verifying Grid Generation ---");
try {
    const grid = generateGrid(4, 4);
    assert(grid.length === 4 && grid[0].length === 4, "Grid dimensions should be 4x4");

    const counts = {};
    grid.flat().forEach(t => {
        counts[t.classKey] = (counts[t.classKey] || 0) + 1;
    });

    const allEven = Object.values(counts).every(c => c % 2 === 0);
    assert(allEven, "All classes should have an even number of tiles");
} catch (e) {
    console.error("Grid generation failed", e);
    failed++;
}

// 3. Verify Pathfinding
console.log("\n--- Verifying Pathfinding ---");
// Create a simple 3x3 grid for testing
// [A, ., A]
// [., ., .]
// [., ., .]
const mockGrid = [
    [{ status: 'idle' }, { status: 'matched' }, { status: 'idle' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }]
];

const start = { row: 0, col: 0 };
const end = { row: 0, col: 2 };

// Should be able to go 0,0 -> 0,1 -> 0,2 (Straight line)
const path1 = findPath(mockGrid, start, end);
assert(path1 !== null, "Should find straight path through empty space");

// Obstacle test
// [A, B, A]
// [., ., .]
const mockGrid2 = [
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }]
];
// 0,0 to 0,2 blocked by 0,1. Should go down, right, up.
// 0,0 -> 1,0 -> 1,1 -> 1,2 -> 0,2 (3 turns? No. 
// 0,0(start) -> 1,0(down) -> 1,2(right) -> 0,2(up). 
// Turns: 
// 1. Start -> Down (0 turns if we don't count start direction, or 1? Logic says: "newTurns = (lastDir !== -1 && lastDir !== i) ? turns + 1 : turns")
// Start(-1) -> Down(1): turns=0
// Down(1) -> Right(3): turns=1
// Right(3) -> Up(0): turns=2
// So it is 2 turns. Should pass.

const path2 = findPath(mockGrid2, start, end);
assert(path2 !== null, "Should find U-shaped path (2 turns)");

// Impossible test (3 turns needed)
// [A, B, A]
// [B, B, B]
// [., ., .]
// Path: Down, Right, Up? Blocked by row 1.
// Needs: Down(to r2), Right(to c2), Up(to r0).
// 0,0 -> 2,0 (Down) -> 2,2 (Right) -> 0,2 (Up).
// Turns:
// Start -> Down: 0
// Down -> Right: 1
// Right -> Up: 2
// So this is actually 2 turns and SHOULD be possible if row 2 is empty.
// Let's make it impossible.
// Surround start with blocks.
const mockGrid3 = [
    [{ status: 'idle' }, { status: 'idle' }, { status: 'idle' }],
    [{ status: 'idle' }, { status: 'matched' }, { status: 'matched' }],
    [{ status: 'matched' }, { status: 'matched' }, { status: 'matched' }]
];
// 0,0 blocked by 0,1 and 1,0.
const path3 = findPath(mockGrid3, start, end);
assert(path3 === null, "Should NOT find path when blocked");


console.log(`\nVerification Complete: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
