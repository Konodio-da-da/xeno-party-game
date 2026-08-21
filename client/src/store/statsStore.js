// client/src/store/statsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateRandomName = () => `Xeno_${Math.floor(Math.random() * 10000)}`;

export const useStatsStore = create(
  persist(
    (set) => ({
      playerName: generateRandomName(),
      setPlayerName: (name) => set({ playerName: name }),
      
      totalGamesPlayed: 0,
      gameCounts: {},
      recentActivity: [],

      recordGamePlayed: (gameId, gameTitle) => set((state) => {
        const newCounts = { ...state.gameCounts };
        newCounts[gameId] = (newCounts[gameId] || 0) + 1;

        const newActivity = [
          { id: Date.now(), gameId, title: gameTitle, date: new Date().toLocaleDateString() },
          ...state.recentActivity
        ].slice(0, 5);

        return {
          totalGamesPlayed: state.totalGamesPlayed + 1,
          gameCounts: newCounts,
          recentActivity: newActivity
        };
      }),

      clearStats: () => set({ totalGamesPlayed: 0, gameCounts: {}, recentActivity: [] })
    }),
    {
      name: 'xeno-stats-storage',
    }
  )
);
