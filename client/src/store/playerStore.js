// client/src/store/playerStore.js
import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  players: [],

  // Add a player to the game
  addPlayer: (name) => set((state) => ({
    players: [...state.players, name.trim()]
  })),

  // Set the entire array of players at once (This is what PlayerSetup needs!)
  setPlayers: (newPlayers) => set({ players: newPlayers }),

  // Remove a player
  removePlayer: (index) => set((state) => ({
    players: state.players.filter((_, i) => i !== index)
  })),

  // Clear all players
  resetPlayers: () => set({ players: [] })
}));
