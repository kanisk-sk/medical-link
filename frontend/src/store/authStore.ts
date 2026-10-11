import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppProfile, Language, SehatLinkRole } from '../types';

interface AuthState {
  language: Language;
  isDemoUser: boolean;
  demoRole: SehatLinkRole | null;
  selectedRoleByUserId: Record<string, SehatLinkRole | undefined>;
  profilesByUserId: Record<string, AppProfile | undefined>;
  setLanguage: (lang: Language) => void;
  setSelectedRole: (userId: string, role: SehatLinkRole) => void;
  setProfile: (profile: AppProfile) => void;
  clearProfile: (userId: string) => void;
  getSelectedRole: (userId?: string | null) => SehatLinkRole | null;
  getProfile: (userId?: string | null) => AppProfile | null;
  setDemoLogin: (role?: SehatLinkRole) => void;
  clearDemoLogin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      language: 'en',
      isDemoUser: false,
      demoRole: null,
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
          if (get().isDemoUser) {
            return get().demoRole || 'patient';
          }
          return null;
        }

        return get().selectedRoleByUserId[userId] ?? (get().isDemoUser ? get().demoRole : null);
      },
      getProfile: (userId) => {
        if (!userId) {
          if (get().isDemoUser) {
            return get().profilesByUserId['demo_dummy_user'] ?? null;
          }
          return null;
        }

        return get().profilesByUserId[userId] ?? null;
      },
      setDemoLogin: (role = 'patient') => {
        const dummyProfile: AppProfile = {
          id: 'demo_dummy_user',
          name: 'Gurpreet Singh (Demo Profile)',
          phone: '+91 98765 43210',
          role: role,
          language: 'ta',
          abhaId: '91-4820-1928-3741',
          age: 60,
          gender: 'Male',
          village: 'Alhoran'
        };

        set((state) => ({
          isDemoUser: true,
          demoRole: role,
          profilesByUserId: {
            ...state.profilesByUserId,
            demo_dummy_user: dummyProfile
          },
          selectedRoleByUserId: {
            ...state.selectedRoleByUserId,
            demo_dummy_user: role
          }
        }));
      },
      clearDemoLogin: () => {
        set({ isDemoUser: false, demoRole: null });
      }
    }),
    {
      name: 'sehatlink-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        isDemoUser: state.isDemoUser,
        demoRole: state.demoRole,
        selectedRoleByUserId: state.selectedRoleByUserId,
        profilesByUserId: state.profilesByUserId,
      }),
    }
  )
);
