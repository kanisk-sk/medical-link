import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppProfile, Language, SehatLinkRole } from '../types';

interface AuthState {
  language: Language;
  selectedRoleByUserId: Record<string, SehatLinkRole | undefined>;
  profilesByUserId: Record<string, AppProfile | undefined>;
  setLanguage: (lang: Language) => void;
  setSelectedRole: (userId: string, role: SehatLinkRole) => void;
  setProfile: (profile: AppProfile) => void;
  clearProfile: (userId: string) => void;
  getSelectedRole: (userId?: string | null) => SehatLinkRole | null;
  getProfile: (userId?: string | null) => AppProfile | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      language: 'pa',
      selectedRoleByUserId: {},
      profilesByUserId: {},
      setLanguage: (language) => set({ language }),
      setSelectedRole: (userId, role) =>
        set((state) => ({
          selectedRoleByUserId: {
            ...state.selectedRoleByUserId,
            [userId]: role,
          },
        })),
      setProfile: (profile) =>
        set((state) => ({
          profilesByUserId: {
            ...state.profilesByUserId,
            [profile.id]: profile,
          },
          selectedRoleByUserId: {
            ...state.selectedRoleByUserId,
            [profile.id]: profile.role ?? state.selectedRoleByUserId[profile.id],
          },
        })),
      clearProfile: (userId) =>
        set((state) => {
          const nextProfiles = { ...state.profilesByUserId };
          const nextRoles = { ...state.selectedRoleByUserId };
          delete nextProfiles[userId];
          delete nextRoles[userId];
          return {
            profilesByUserId: nextProfiles,
            selectedRoleByUserId: nextRoles,
          };
        }),
      getSelectedRole: (userId) => {
        if (!userId) {
          return null;
        }

        return get().selectedRoleByUserId[userId] ?? null;
      },
      getProfile: (userId) => {
        if (!userId) {
          return null;
        }

        return get().profilesByUserId[userId] ?? null;
      },
    }),
    {
      name: 'sehatlink-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        selectedRoleByUserId: state.selectedRoleByUserId,
        profilesByUserId: state.profilesByUserId,
      }),
    }
  )
);
