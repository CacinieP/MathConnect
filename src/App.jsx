import { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import LevelSelect from './components/LevelSelect';
import SettingsPanel from './components/SettingsPanel';
import BackgroundCanvas from './components/BackgroundCanvas';
import { loadProgress, saveProgress, loadSettings, saveSettings, getDefaultProgress, getDefaultSettings } from './utils/storage.js';
import { LEVEL_ORDER, getLevel, getNextLevelId } from './data/levels.js';
import { t } from './utils/i18n.js';
import './index.css';

function App() {
  const [settings, setSettings] = useState(() => loadSettings() || getDefaultSettings());
  const [progress, setProgress] = useState(() => loadProgress() || getDefaultProgress());
  const [view, setView] = useState('menu'); // 'menu' | 'game'
  const [currentLevelId, setCurrentLevelId] = useState('infinitesimals');
  const [mode, setMode] = useState('classic');
  const [difficulty, setDifficulty] = useState('normal');

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  const handleSelectLevel = useCallback((levelId) => {
    setCurrentLevelId(levelId);
    setView('game');
  }, []);

  const handleLevelComplete = useCallback((levelId, options = {}) => {
    setProgress(prev => {
      const nextLevel = getNextLevelId(levelId);
      const unlocked = new Set(prev.unlockedLevels);
      if (nextLevel) unlocked.add(nextLevel);

      return {
        ...prev,
        unlockedLevels: Array.from(unlocked),
        achievements: options.achievements ?? prev.achievements
      };
    });

    if (options.advance) {
      const nextLevel = getNextLevelId(levelId);
      if (nextLevel) {
        setCurrentLevelId(nextLevel);
      } else {
        setView('menu');
      }
    }
  }, []);

  const handleBackToMenu = useCallback(() => {
    setView('menu');
  }, []);

  const level = getLevel(currentLevelId);

  return (
    <div className="App">
      <BackgroundCanvas themeColor={level.themeColor} reducedParticles={settings.reducedParticles} />
      <SettingsPanel settings={settings} onChange={handleSettingsChange} lang={settings.lang} />

      {view === 'menu' ? (
        <div className="game-container">
          <LevelSelect
            progress={progress}
            onSelectLevel={handleSelectLevel}
            lang={settings.lang}
          />

          <div className="menu-options">
            <div className="option-card">
              <h3 className="option-card-title">{t('mode', settings.lang)}</h3>
              {['guide', 'classic', 'challenge'].map(m => (
                <label key={m} className="option-label">
                  <input
                    type="radio"
                    className="option-input"
                    name="mode"
                    value={m}
                    checked={mode === m}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>{t(`${m}Mode`, settings.lang)}</span>
                </label>
              ))}
            </div>

            <div className="option-card">
              <h3 className="option-card-title">{t('difficulty', settings.lang)}</h3>
              {['easy', 'normal', 'hard'].map(d => (
                <label key={d} className="option-label">
                  <input
                    type="radio"
                    className="option-input"
                    name="difficulty"
                    value={d}
                    checked={difficulty === d}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  <span>{t(d, settings.lang)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <GameBoard
          key={`${currentLevelId}-${mode}-${difficulty}`}
          levelId={currentLevelId}
          mode={mode}
          difficulty={difficulty}
          lang={settings.lang}
          settings={settings}
          progress={progress}
          onBackToMenu={handleBackToMenu}
          onLevelComplete={handleLevelComplete}
        />
      )}
    </div>
  );
}

export default App;
