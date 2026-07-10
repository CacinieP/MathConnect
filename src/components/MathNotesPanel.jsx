import { InlineMath } from 'react-katex';
import { t } from '../utils/i18n.js';

export default function MathNotesPanel({ level, lang = 'zh', onClose }) {
  const groups = Object.values(level.groups || {});

  return (
    <>
      <div className="math-notes-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="math-notes-panel" role="dialog" aria-modal="true" aria-label={t('mathNotes', lang)}>
        <h3>{t('mathNotes', lang)}</h3>
        {groups.map((group) => (
          <div key={group.id} className="math-notes-group">
            <h4 style={{ color: `var(--${group.id.replace(/_/g, '-')}, var(--accent))` }}>
              <span
                className="family-badge-dot"
                style={{ '--badge-color': group.color }}
              />
              {lang === 'zh' ? group.label : group.labelEn}
            </h4>
            <p>{lang === 'zh' ? group.explanation : group.explanationEn}</p>
            <div className="math-notes-expressions">
              {group.expressions.map((expr, idx) => (
                <span key={idx}>
                  <InlineMath math={expr} />
                </span>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="reset-button"
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {t('backToMenu', lang)}
        </button>
      </aside>
    </>
  );
}
