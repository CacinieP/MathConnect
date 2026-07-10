import { useState, useRef, useEffect } from 'react';
import { t } from '../utils/i18n.js';

export default function SettingsPanel({ settings, onChange, lang = 'zh' }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleSetting = (key) => {
    onChange({ ...settings, [key]: !settings[key] });
  };

  const setLang = (newLang) => {
    onChange({ ...settings, lang: newLang });
  };

  return (
    <div className="settings-panel" ref={panelRef}>
      <button
        type="button"
        className="settings-button"
        onClick={() => setOpen(!open)}
        aria-label={t('settings', lang)}
        aria-expanded={open}
      >
        ⚙
      </button>
      {open && (
        <div className="settings-dropdown">
          <div className="setting-row">
            <span>{t('sound', lang)}</span>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={() => toggleSetting('sound')}
            />
          </div>
          <div className="setting-row">
            <span>{t('reducedParticles', lang)}</span>
            <input
              type="checkbox"
              checked={settings.reducedParticles}
              onChange={() => toggleSetting('reducedParticles')}
            />
          </div>
          <div className="setting-row">
            <span>{t('language', lang)}</span>
            <select value={settings.lang} onChange={(e) => setLang(e.target.value)}>
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
