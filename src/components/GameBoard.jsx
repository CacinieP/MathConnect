import React, { useState, useEffect, useCallback } from 'react';
import Tile from './Tile';
import { generateGrid, checkMatch, findPath } from '../utils/gameLogic';
import classNames from 'classnames';

const GameBoard = () => {
    const [grid, setGrid] = useState([]);
    const [selectedTile, setSelectedTile] = useState(null);
    const [path, setPath] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize Game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        try {
            const newGrid = generateGrid(6, 10); // 6x10 grid
            setGrid(newGrid);
            setSelectedTile(null);
            setPath(null);
        } catch (e) {
            console.error("Failed to generate grid", e);
        }
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
            // Check path
            const foundPath = findPath(grid,
                { row: selectedTile.row, col: selectedTile.col },
                { row: tile.row, col: tile.col }
            );

            if (foundPath) {
                // Valid Match with Path
                setPath(foundPath);

                // Wait for animation
                await new Promise(r => setTimeout(r, 500));

                // Update grid to remove tiles
                setGrid(prevGrid => {
                    const newGrid = prevGrid.map(row => row.map(t => ({ ...t })));
                    newGrid[selectedTile.row][selectedTile.col].status = 'matched';
                    newGrid[tile.row][tile.col].status = 'matched';
                    return newGrid;
                });
            } else {
                // Match but no path (shouldn't happen often if logic is right, but possible)
                // For now treat as error or just ignore? 
                // Lianliankan rules: must have path.
                await triggerError(tile);
            }
        } else {
            // No match
            await triggerError(tile);
        }

        // Reset state
        setPath(null);
        setSelectedTile(null);
        setIsProcessing(false);
    };

    const triggerError = async (secondTile) => {
        // Visual feedback for error could be added here
        // For now just a small delay
        await new Promise(r => setTimeout(r, 300));
    };

    return (
        <div className="game-container">
            <h1 className="game-title">
                MATH <span className="highlight">CONNECT</span>
            </h1>

            <div className="game-board">
                {/* Grid Layer */}
                <div className="grid-layer" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 10}, minmax(0, 1fr))` }}>
                    {grid.map((row, rIndex) => (
                        row.map((tile, cIndex) => (
                            <Tile
                                key={tile.id}
                                content={tile.content}
                                status={tile.status}
                                isSelected={selectedTile?.id === tile.id}
                                onClick={() => handleTileClick(tile)}
                            />
                        ))
                    ))}
                </div>

                {/* Path Overlay Layer */}
                {path && (
                    <svg className="path-layer">
                        <polyline
                            points={path.map(p => {
                                // Calculate center of tile. 
                                // Assuming tile is approx 80px + margin. 
                                // This is tricky without exact refs. 
                                // Let's use percentage based on grid size.
                                const x = (p.col + 0.5) * (100 / grid[0].length);
                                const y = (p.row + 0.5) * (100 / grid.length);
                                return `${x}%,${y}%`;
                            }).join(' ')}
                            className="path-line"
                        />
                    </svg>
                )}
            </div>

            <button
                onClick={startNewGame}
                className="reset-button"
            >
                Reset Game
            </button>
        </div>
    );
};

export default GameBoard;
