import React, { useMemo, useState } from 'react';
import Tile from './Tile';
import { generateGrid, checkMatch, findPath } from '../utils/gameLogic';

const INTRO_MESSAGE = 'Match formulas that behave the same as x approaches 0.';
const ROWS = 6;
const COLS = 10;
const MOBILE_ROWS = 8;
const MOBILE_COLS = 6;

const getBoardSize = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
        return { rows: MOBILE_ROWS, cols: MOBILE_COLS };
    }

    return { rows: ROWS, cols: COLS };
};

const createInitialGrid = () => {
    try {
        const { rows, cols } = getBoardSize();
        return generateGrid(rows, cols);
    } catch (e) {
        console.error("Failed to generate grid", e);
        return [];
    }
};

const GameBoard = () => {
    const [grid, setGrid] = useState(createInitialGrid);
    const [selectedTile, setSelectedTile] = useState(null);
    const [path, setPath] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorTileIds, setErrorTileIds] = useState([]);
    const [moveCount, setMoveCount] = useState(0);
    const [message, setMessage] = useState(INTRO_MESSAGE);

    const totalTiles = grid.length * (grid[0]?.length || 0);
    const matchedTiles = useMemo(
        () => grid.flat().filter(tile => tile.status === 'matched').length,
        [grid]
    );
    const remainingTiles = totalTiles - matchedTiles;
    const progress = totalTiles ? Math.round((matchedTiles / totalTiles) * 100) : 0;

    const startNewGame = () => {
        setGrid(createInitialGrid());
        setSelectedTile(null);
        setPath(null);
        setErrorTileIds([]);
        setMoveCount(0);
        setMessage(INTRO_MESSAGE);
    };

    const triggerError = async (tiles, feedback) => {
        setErrorTileIds(tiles.map(tile => tile.id));
        setMessage(feedback);
        await new Promise(r => setTimeout(r, 320));
        setErrorTileIds([]);
    };

    const getPathPoint = (point) => {
        const rows = grid.length || 1;
        const cols = grid[0]?.length || 1;
        const x = point.col < 0 ? 0 : point.col >= cols ? 100 : (point.col + 0.5) * (100 / cols);
        const y = point.row < 0 ? 0 : point.row >= rows ? 100 : (point.row + 0.5) * (100 / rows);

        return `${x}%,${y}%`;
    };

    const handleTileClick = async (tile) => {
        if (isProcessing || tile.status === 'matched') return;

        // If clicking the same tile, deselect
        if (selectedTile && selectedTile.id === tile.id) {
            setSelectedTile(null);
            return;
        }

        // If no tile selected, select this one
        if (!selectedTile) {
            setSelectedTile(tile);
            return;
        }

        // If another tile is selected, check match
        setIsProcessing(true);
        const match = checkMatch(selectedTile, tile);

        if (match) {
            const foundPath = findPath(grid,
                { row: selectedTile.row, col: selectedTile.col },
                { row: tile.row, col: tile.col }
            );

            if (foundPath) {
                setPath(foundPath);
                setMoveCount(count => count + 1);

                await new Promise(r => setTimeout(r, 500));

                setGrid(prevGrid => {
                    const newGrid = prevGrid.map(row => row.map(t => ({ ...t })));
                    newGrid[selectedTile.row][selectedTile.col].status = 'matched';
                    newGrid[tile.row][tile.col].status = 'matched';
                    return newGrid;
                });

                const nextMatchedTiles = matchedTiles + 2;
                setMessage(
                    nextMatchedTiles === totalTiles
                        ? 'Board cleared. Start a new round when ready.'
                        : 'Connected. Keep clearing equivalent formulas.'
                );
            } else {
                await triggerError(
                    [selectedTile, tile],
                    'Equivalent formulas still need a path with two turns or fewer.'
                );
            }
        } else {
            await triggerError(
                [selectedTile, tile],
                'Not the same infinitesimal family. Try another pair.'
            );
        }

        // Reset state
        setPath(null);
        setSelectedTile(null);
        setIsProcessing(false);
    };

    return (
        <div className="game-container">
            <main className="game-shell">
                <section className="intro-panel" aria-labelledby="game-title">
                    <p className="eyebrow">Calculus memory puzzle</p>
                    <h1 id="game-title" className="game-title">
                        Math<span>Connect</span>
                    </h1>
                    <p className="tagline">
                        Pair equivalent infinitesimals, then clear them through an open path with at most two turns.
                    </p>
                    <div className="formula-strip" aria-label="Example equivalent infinitesimals">
                        <span>sin x ~ x</span>
                        <span>tan x ~ x</span>
                        <span>e^x - 1 ~ x</span>
                    </div>
                    <ol className="rule-list">
                        <li>Choose two formulas from the same infinitesimal family.</li>
                        <li>Use empty space or the outside edge to connect the path.</li>
                        <li>Clear all {totalTiles || 60} tiles to finish the round.</li>
                    </ol>
                </section>

                <section className="play-panel" aria-label="MathConnect board">
                    <div className="hud-row">
                        <div className="hud-item">
                            <span>Level</span>
                            <strong>Equivalent infinitesimals</strong>
                        </div>
                        <div className="hud-item">
                            <span>Remaining</span>
                            <strong>{remainingTiles || 0}</strong>
                        </div>
                        <div className="hud-item">
                            <span>Moves</span>
                            <strong>{moveCount}</strong>
                        </div>
                        <div className="hud-item">
                            <span>Cleared</span>
                            <strong>{progress}%</strong>
                        </div>
                    </div>

                    <div className="game-board">
                        <div
                            className="grid-layer"
                            role="grid"
                            aria-label="Equivalent infinitesimal tiles"
                            style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 10}, var(--tile-width))` }}
                        >
                            {grid.map(row => (
                                row.map(tile => (
                                    <Tile
                                        key={tile.id}
                                        content={tile.content}
                                        status={tile.status}
                                        isSelected={selectedTile?.id === tile.id}
                                        isError={errorTileIds.includes(tile.id)}
                                        onClick={() => handleTileClick(tile)}
                                    />
                                ))
                            ))}
                        </div>

                        {path && (
                            <svg className="path-layer" aria-hidden="true">
                                <polyline
                                    points={path.map(getPathPoint).join(' ')}
                                    className="path-line"
                                />
                            </svg>
                        )}
                    </div>

                    <div className="control-row">
                        <button
                            type="button"
                            onClick={startNewGame}
                            className="reset-button"
                        >
                            New round
                        </button>
                        <p className="status-message" aria-live="polite">{message}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default GameBoard;
