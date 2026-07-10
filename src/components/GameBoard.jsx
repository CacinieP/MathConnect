import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Tile from './Tile';
import VictoryModal from './VictoryModal';
import RulePanel from './RulePanel';
import MathNotesPanel from './MathNotesPanel';
import { useGameTimer } from '../hooks/useGameTimer.js';
import { checkMatch, findPath, generateSolvableGrid } from '../utils/gameLogic.js';
import { getLevel } from '../data/levels.js';
import { formatTime } from '../utils/scoring.js';
import { playSelectSound, playMatchSound, playErrorSound, isAudioEnabled } from '../utils/sound.js';
import { checkAchievements, getAchievementTitle } from '../utils/achievements.js';
import { t } from '../utils/i18n.js';

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

const GameBoard = ({
    levelId,
    mode = 'classic',
    difficulty = 'normal',
    lang = 'zh',
    settings,
    progress,
    onBackToMenu,
    onLevelComplete
}) => {
    const level = useMemo(() => getLevel(levelId), [levelId]);
    const [grid, setGrid] = useState(() => {
        const { rows, cols } = getBoardSize();
        return generateSolvableGrid(rows, cols, levelId, difficulty);
    });
    const [selectedTile, setSelectedTile] = useState(null);
    const [path, setPath] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorTileIds, setErrorTileIds] = useState([]);
    const [moveCount, setMoveCount] = useState(0);
    const [message, setMessage] = useState('');
    const [showVictory, setShowVictory] = useState(false);
    const [showMathNotes, setShowMathNotes] = useState(false);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [successfulMatches, setSuccessfulMatches] = useState(0);
    const [totalClicks, setTotalClicks] = useState(0);
    const [achievementToasts, setAchievementToasts] = useState([]);
    const pathLineRef = useRef(null);

    const { elapsed, reset: resetTimer } = useGameTimer(!showVictory);

    const totalTiles = grid.length * (grid[0]?.length || 0);
    const matchedTiles = useMemo(
        () => grid.flat().filter(tile => tile.status === 'matched').length,
        [grid]
    );
    const remainingTiles = totalTiles - matchedTiles;
    const progressPercent = totalTiles ? Math.round((matchedTiles / totalTiles) * 100) : 0;

    const resetGame = useCallback(() => {
        const { rows, cols } = getBoardSize();
        setGrid(generateSolvableGrid(rows, cols, levelId, difficulty));
        setSelectedTile(null);
        setPath(null);
        setErrorTileIds([]);
        setMoveCount(0);
        setMessage('');
        setShowVictory(false);
        setStreak(0);
        setMaxStreak(0);
        setSuccessfulMatches(0);
        setTotalClicks(0);
        resetTimer();
    }, [levelId, difficulty, resetTimer]);

    useEffect(() => {
        if (pathLineRef.current && path) {
            const el = pathLineRef.current;
            const length = el.getTotalLength();
            el.style.strokeDasharray = length;
            el.style.strokeDashoffset = length;
            requestAnimationFrame(() => {
                el.style.transition = 'stroke-dashoffset 300ms ease-out';
                el.style.strokeDashoffset = 0;
            });
        }
    }, [path]);

    const triggerError = async (tiles, feedback) => {
        setErrorTileIds(tiles.map(tile => tile.id));
        setMessage(feedback);
        setStreak(0);
        if (isAudioEnabled(settings)) playErrorSound();
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

    const getFamilyColor = (tile) => {
        if (mode === 'challenge') return 'var(--muted-text)';
        return tile.familyColor || 'var(--muted-text)';
    };

    const buildExplanation = (tile) => {
        const group = level.groups[tile.classKey];
        if (!group) return '';
        const explanation = lang === 'zh' ? group.explanation : group.explanationEn;
        const label = lang === 'zh' ? group.label : group.labelEn;
        return `${label}：${explanation}`;
    };

    const handleTileClick = async (tile) => {
        if (isProcessing || tile.status === 'matched') return;

        setTotalClicks(c => c + 1);

        if (selectedTile && selectedTile.id === tile.id) {
            setSelectedTile(null);
            return;
        }

        if (!selectedTile) {
            setSelectedTile(tile);
            if (isAudioEnabled(settings)) playSelectSound();
            return;
        }

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
                setStreak(s => {
                    const newStreak = s + 1;
                    setMaxStreak(ms => Math.max(ms, newStreak));
                    return newStreak;
                });
                setSuccessfulMatches(c => c + 1);
                if (isAudioEnabled(settings)) playMatchSound(streak + 1);

                await new Promise(r => setTimeout(r, 500));

                setGrid(prevGrid => {
                    const newGrid = prevGrid.map(row => row.map(t => ({ ...t })));
                    newGrid[selectedTile.row][selectedTile.col].status = 'matched';
                    newGrid[tile.row][tile.col].status = 'matched';
                    return newGrid;
                });

                const explanation = buildExplanation(selectedTile);
                const nextMatchedTiles = matchedTiles + 2;
                if (nextMatchedTiles === totalTiles) {
                    setMessage(explanation);
                    setShowVictory(true);
                    const stats = {
                      elapsedSeconds: elapsed,
                      moves: moveCount + 1,
                      maxStreak: Math.max(maxStreak, streak + 1),
                      successfulMatches: successfulMatches + 1,
                      totalClicks: totalClicks + 1
                    };
                    const result = checkAchievements(stats, progress);
                    if (result.newlyUnlocked.length > 0) {
                        setAchievementToasts(result.newlyUnlocked);
                        setTimeout(() => setAchievementToasts([]), 3000);
                    }
                    if (onLevelComplete) onLevelComplete(levelId, { achievements: result.achievements });
                } else {
                    setMessage(explanation);
                }
            } else {
                await triggerError(
                    [selectedTile, tile],
                    t('rule2', lang)
                );
            }
        } else {
            await triggerError(
                [selectedTile, tile],
                lang === 'zh'
                    ? '不属于同一数学关系族，请尝试其他配对。'
                    : 'Not the same mathematical family. Try another pair.'
            );
        }

        setPath(null);
        setSelectedTile(null);
        setIsProcessing(false);
    };

    const pathColor = useMemo(() => {
        if (!selectedTile || !path) return 'var(--accent)';
        if (mode === 'challenge') return 'var(--muted-text)';
        return selectedTile.familyColor || 'var(--muted-text)';
    }, [selectedTile, path, mode]);

    const renderPath = () => {
        if (!path) return null;
        const points = path.map(getPathPoint).join(' ');
        const corners = path.slice(1, -1);

        return (
            <svg className="path-layer" aria-hidden="true">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={pathColor} stopOpacity="0.6" />
                        <stop offset="50%" stopColor={pathColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={pathColor} stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                <polyline
                    ref={pathLineRef}
                    points={points}
                    className="path-line"
                    stroke="url(#pathGradient)"
                    style={{ color: pathColor }}
                />
                {corners.map((point, idx) => (
                    <circle
                        key={idx}
                        cx={`${(point.col + 0.5) * (100 / (grid[0]?.length || 1))}%`}
                        cy={`${(point.row + 0.5) * (100 / (grid.length || 1))}%`}
                        r="3"
                        className="path-corner"
                        style={{ color: pathColor }}
                    />
                ))}
            </svg>
        );
    };

    return (
        <div className="game-container">
            <main className="game-shell">
                <section className="intro-panel" aria-labelledby="game-title">
                    <p className="eyebrow">{t('gameTitle', lang)}</p>
                    <h1 id="game-title" className="game-title">
                        Math<span>Connect</span>
                    </h1>
                    <p className="tagline">
                        {lang === 'zh' ? level.descriptionZh : level.description}
                    </p>
                    <div className="formula-strip" aria-label="Example equivalent infinitesimals">
                        <span>sin x ~ x</span>
                        <span>tan x ~ x</span>
                        <span>e^x - 1 ~ x</span>
                    </div>
                    <ol className="rule-list">
                        <li>{t('rule1', lang)}</li>
                        <li>{t('rule2', lang)}</li>
                        <li>{t('rule3', lang)}</li>
                    </ol>
                    <RulePanel level={level} lang={lang} />
                    <button
                        type="button"
                        onClick={() => setShowMathNotes(true)}
                        className="reset-button"
                        style={{ marginTop: '0.75rem' }}
                    >
                        {t('mathNotes', lang)}
                    </button>
                    <button
                        type="button"
                        onClick={onBackToMenu}
                        className="reset-button"
                        style={{ marginTop: '0.5rem', background: 'var(--surface)' }}
                    >
                        {t('backToMenu', lang)}
                    </button>
                </section>

                <section className="play-panel" aria-label="MathConnect board">
                    <div className="hud-row">
                        <div className="hud-item">
                            <span>{t('level', lang)}</span>
                            <strong className="hud-accent">
                                {lang === 'zh' ? level.titleZh : level.title}
                            </strong>
                            <div className="progress-bar">
                                <div
                                    className={`progress-fill ${matchedTiles > 0 ? 'bump' : ''}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                        <div className="hud-item">
                            <span>{t('remaining', lang)}</span>
                            <strong>{remainingTiles || 0}</strong>
                        </div>
                        <div className="hud-item">
                            <span>{t('moves', lang)}</span>
                            <strong>{moveCount}</strong>
                        </div>
                        <div className="hud-item">
                            <span>{t('time', lang)}</span>
                            <strong>{formatTime(elapsed)}</strong>
                        </div>
                        <div className="hud-item">
                            <span>{t('streak', lang)}</span>
                            <strong>×{streak}</strong>
                        </div>
                    </div>

                    <div className="game-board">
                        <div
                            className="grid-layer"
                            role="grid"
                            aria-label="Math tiles"
                            style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 10}, minmax(0, 1fr))` }}
                        >
                            {grid.map(row => (
                                row.map(tile => (
                                    <Tile
                                        key={tile.id}
                                        content={tile.content}
                                        status={tile.status}
                                        isSelected={selectedTile?.id === tile.id}
                                        isError={errorTileIds.includes(tile.id)}
                                        familyColor={getFamilyColor(tile)}
                                        onClick={() => handleTileClick(tile)}
                                    />
                                ))
                            ))}
                        </div>

                        {renderPath()}
                    </div>

                    <div className="control-row">
                        <button
                            type="button"
                            onClick={resetGame}
                            className="reset-button"
                        >
                            {t('newRound', lang)}
                        </button>
                        <p className="status-message" aria-live="polite">{message}</p>
                    </div>
                </section>
            </main>

            {showVictory && (
                <VictoryModal
                    level={level}
                    elapsedSeconds={elapsed}
                    moves={moveCount}
                    totalPairs={totalTiles / 2}
                    maxStreak={maxStreak}
                    successfulMatches={successfulMatches}
                    totalClicks={totalClicks}
                    onReplay={resetGame}
                    onNextLevel={onLevelComplete ? () => onLevelComplete(levelId, { advance: true }) : undefined}
                    onBackToMenu={onBackToMenu}
                    lang={lang}
                />
            )}

            {showMathNotes && (
                <MathNotesPanel
                    level={level}
                    lang={lang}
                    onClose={() => setShowMathNotes(false)}
                />
            )}

            {achievementToasts.map((achievement) => (
                <div key={achievement.id} className="streak-floater" style={{ top: '20%', left: '50%' }}>
                    🏆 {getAchievementTitle(achievement, lang)}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
