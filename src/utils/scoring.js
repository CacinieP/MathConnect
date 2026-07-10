export function calculateScore({ elapsedSeconds, moves, totalPairs, maxStreak, successfulMatches, totalClicks }) {
  const base = 1000;
  const timeBonus = Math.max(0, 300 - elapsedSeconds) * 5;
  const moveBonus = Math.max(0, totalPairs * 2 - moves) * 20;
  const streakBonus = maxStreak * 50;
  const accuracy = totalClicks > 0 ? successfulMatches / totalClicks : 0;
  const accuracyBonus = Math.round(accuracy * 500);

  return base + timeBonus + moveBonus + streakBonus + accuracyBonus;
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
