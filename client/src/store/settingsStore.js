// client/src/store/settingsStore.js
import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  hapticsEnabled: true,
  soundEnabled: true,
  
  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled }))
}));
