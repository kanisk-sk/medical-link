import { create } from 'zustand';
import { OfflineQueueItem } from '../types';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  queue: OfflineQueueItem[];
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'createdAt' | 'synced'>) => void;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: navigator.onLine,
  isSyncing: false,
  pendingCount: 0,
  queue: [],
  setOnlineStatus: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  addToQueue: (item) =>
    set((state) => {
      const newItem: OfflineQueueItem = {
        ...item,
        id: 'q-' + Date.now(),
        createdAt: new Date().toISOString(),
        synced: false,
      };
      const updatedQueue = [...state.queue, newItem];
      return { queue: updatedQueue, pendingCount: updatedQueue.length };
    }),
  clearQueue: () => set({ queue: [], pendingCount: 0 }),
}));
