import { calculateScore, formatTime } from '../utils/scoring.js';
import { t } from '../utils/i18n.js';

export default function VictoryModal({
  level,
  elapsedSeconds,
  moves,
  totalPairs,
  maxStreak,
  successfulMatches,
  totalClicks,
  onReplay,
  onNextLevel,
  onBackToMenu,
  lang = 'zh'
}) {
  const score = calculateScore({ elapsedSeconds, moves, totalPairs, maxStreak, successfulMatches, totalClicks });
  const accuracy = totalClicks > 0 ? Math.round((successfulMatches / totalClicks) * 100) : 0;
  const hasNext = !!onNextLevel;

  return (
    <div className="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="victory-modal">
        <h2 id="victory-title">{t('victoryTitle', lang)}</h2>
        <p className="subtitle">{level.titleZh || level.title}</p>

        <div className="victory-stats">
          <div className="victory-stat">
            <span>{t('time', lang)}</span>
            <strong>{formatTime(elapsedSeconds)}</strong>
          </div>
          <div className="victory-stat">
            <span>{t('moves', lang)}</span>
            <strong>{moves}</strong>
          </div>
          <div className="victory-stat">
            <span>{t('accuracy', lang)}</span>
            <strong>{accuracy}%</strong>
          </div>
          <div className="victory-stat">
            <span>{t('bestStreak', lang)}</span>
            <strong>×{maxStreak}</strong>
          </div>
          <div className="victory-stat">
            <span>{t('score', lang)}</span>
            <strong>{score}</strong>
          </div>
          <div className="victory-stat">
            <span>{t('cleared', lang)}</span>
            <strong>100%</strong>
          </div>
        </div>

        <div className="victory-actions">
          {hasNext && (
            <button type="button" className="primary" onClick={onNextLevel}>
              {t('nextLevel', lang)}
            </button>
          )}
          <button type="button" onClick={onReplay}>
            {t('replay', lang)}
          </button>
          <button type="button" onClick={onBackToMenu}>
            {t('backToMenu', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
