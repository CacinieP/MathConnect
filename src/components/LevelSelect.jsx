import { LEVEL_ORDER, getLevel } from '../data/levels.js';
import { t } from '../utils/i18n.js';

export default function LevelSelect({ progress, onSelectLevel, lang = 'zh' }) {
  const unlocked = new Set(progress?.unlockedLevels || ['infinitesimals']);

  return (
    <div className="level-select">
      <h1>{t('gameTitle', lang)}</h1>
      <p className="level-select-subtitle">{t('selectLevel', lang)}</p>
      <div className="level-grid">
        {LEVEL_ORDER.map((levelId) => {
          const level = getLevel(levelId);
          const isLocked = !unlocked.has(levelId);
          return (
            <button
              key={levelId}
              type="button"
              className={`level-card ${isLocked ? 'locked' : ''}`}
              disabled={isLocked}
              onClick={() => onSelectLevel(levelId)}
            >
              <h3>
                <span className="level-card-title">
                  {lang === 'zh' ? level.titleZh : level.title}
                </span>
                {isLocked && <span className="lock-icon">🔒</span>}
              </h3>
              <p>{lang === 'zh' ? level.descriptionZh : level.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
