let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ frequency, type = 'sine', duration, volume = 0.05 }) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // Ignore audio errors
  }
}

export function playSelectSound() {
  playTone({ frequency: 800, type: 'sine', duration: 60, volume: 0.04 });
}

export function playMatchSound(streak = 1) {
  const baseFreq = 440;
  const freq = baseFreq + (streak - 1) * 80;
  playTone({ frequency: Math.min(freq, 1200), type: 'triangle', duration: 180, volume: 0.06 });
}

export function playErrorSound() {
  playTone({ frequency: 150, type: 'square', duration: 120, volume: 0.05 });
}

export function isAudioEnabled(settings) {
  return settings?.sound === true;
}
