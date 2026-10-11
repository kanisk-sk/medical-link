import { useUser } from '@clerk/react';
import { useAuthStore } from '../store/authStore';

export function useSehatLinkIdentity() {
  const { user, isLoaded, isSignedIn: clerkSignedIn } = useUser();
  const isDemoUser = useAuthStore((state) => state.isDemoUser);
  const demoRole = useAuthStore((state) => state.demoRole);
  const language = useAuthStore((state) => state.language);
  const getProfile = useAuthStore((state) => state.getProfile);
  const getSelectedRole = useAuthStore((state) => state.getSelectedRole);

  const effectiveUserId = isDemoUser ? 'demo_dummy_user' : (user?.id ?? null);
  const profile = getProfile(effectiveUserId);
  const selectedRole = isDemoUser ? (demoRole || 'patient') : getSelectedRole(effectiveUserId);

  const name = isDemoUser
    ? (profile?.name || 'Gurpreet Singh (Demo Profile)')
    : (profile?.name ||
       user?.fullName ||
       [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
       user?.emailAddresses[0]?.emailAddress ||
       'SehatLink Member');

  const phone = isDemoUser ? '+91 98765 43210' : (profile?.phone || user?.phoneNumbers[0]?.phoneNumber || '');
  const village = profile?.village || 'Alhoran';
  const abhaId = profile?.abhaId || '91-4820-1928-3741';

  return {
    user,
    profile,
    selectedRole,
    language,
    isLoaded,
    isSignedIn: clerkSignedIn || isDemoUser,
    name,
    phone,
    village,
    abhaId,
    isDemoUser
  };
}