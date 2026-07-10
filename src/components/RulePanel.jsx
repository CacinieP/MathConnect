import { InlineMath } from 'react-katex';
import { t } from '../utils/i18n.js';

export default function RulePanel({ level, lang = 'zh' }) {
  const groups = Object.values(level.groups || {});

  return (
    <details className="rule-panel">
      <summary>{t('howItWorks', lang)}</summary>
      <div className="rule-panel-content">
        <p>{t('rule1', lang)}</p>
        <p>{t('rule2', lang)}</p>
        <p>{t('rule3', lang)}</p>

        <div className="family-legend">
          {groups.map((group) => (
            <span
              key={group.id}
              className="family-badge"
              style={{ '--badge-color': group.color }}
            >
              <span className="family-badge-dot" />
              <span>{lang === 'zh' ? group.label : group.labelEn}</span>
            </span>
          ))}
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ marginBottom: '0.35rem' }}>
            {lang === 'zh' ? '示例：' : 'Example:'}
          </p>
          <InlineMath math="\sin x \sim x" />
        </div>
      </div>
    </details>
  );
}
