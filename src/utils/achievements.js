export const ACHIEVEMENTS = {
  firstWin: {
    id: 'firstWin',
    title: '首次清盘',
    titleEn: 'First Win',
    condition: () => true
  },
  speedster: {
    id: 'speedster',
    title: '速战速决',
    titleEn: 'Speedster',
    condition: ({ elapsedSeconds }) => elapsedSeconds <= 45
  },
  streak5: {
    id: 'streak5',
    title: '五连击',
    titleEn: 'Streak 5',
    condition: ({ maxStreak }) => maxStreak >= 5
  },
  noMistakes: {
    id: 'noMistakes',
    title: '无错大师',
    titleEn: 'No Mistakes',
    condition: ({ successfulMatches, totalClicks }) => {
      return totalClicks > 0 && successfulMatches * 2 === totalClicks;
    }
  },
  explorer: {
    id: 'explorer',
    title: '关系探索者',
    titleEn: 'Explorer',
    condition: ({ progress }) => {
      return progress?.unlockedLevels?.length >= 7;
    }
  }
};

export function checkAchievements(stats, progress) {
  const unlocked = new Set(progress?.achievements || []);
  const newlyUnlocked = [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!unlocked.has(achievement.id)) {
      const earned = achievement.condition({ ...stats, progress });
      if (earned) {
        unlocked.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }
  });

  return {
    achievements: Array.from(unlocked),
    newlyUnlocked
  };
}

export function getAchievementTitle(achievement, lang = 'zh') {
  return lang === 'zh' ? achievement.title : achievement.titleEn;
}
