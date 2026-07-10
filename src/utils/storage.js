const PREFIX = 'mathconnect:';

function getKey(key) {
  return `${PREFIX}${key}`;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(getKey('progress'));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(getKey('progress'), JSON.stringify(progress));
  } catch {
    // Ignore storage errors (e.g., private mode)
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(getKey('settings'));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(getKey('settings'), JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function getDefaultProgress() {
  return {
    unlockedLevels: ['infinitesimals'],
    bestScores: {},
    bestTimes: {},
    achievements: []
  };
}

export function getDefaultSettings() {
  return {
    sound: false,
    reducedParticles: false,
    lang: 'zh'
  };
}
