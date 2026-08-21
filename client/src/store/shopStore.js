// client/src/store/shopStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useShopStore = create(
  persist(
    (set, get) => ({
      unlockedPacks: ['starter'], // Free default pack

      unlockPack: (packId) => set((state) => ({
        unlockedPacks: [...state.unlockedPacks, packId]
      })),

      isPackUnlocked: (packId) => {
        return get().unlockedPacks.includes(packId);
      }
    }),
    {
      name: 'xeno-shop-storage'
    }
  )
);
