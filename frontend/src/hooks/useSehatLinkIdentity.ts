import { useUser } from '@clerk/react';
import { useAuthStore } from '../store/authStore';

export function useSehatLinkIdentity() {
  const { user, isLoaded, isSignedIn } = useUser();
  const language = useAuthStore((state) => state.language);
  const getProfile = useAuthStore((state) => state.getProfile);
  const getSelectedRole = useAuthStore((state) => state.getSelectedRole);

  const profile = getProfile(user?.id ?? null);
  const selectedRole = getSelectedRole(user?.id ?? null);
  const name =
    profile?.name ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.emailAddresses[0]?.emailAddress ||
    'SehatLink member';
  const phone = profile?.phone || user?.phoneNumbers[0]?.phoneNumber || '';
  const village = profile?.village || 'Alhoran, Nabha';
  const abhaId = profile?.abhaId || 'Linked';

  return {
    user,
    profile,
    selectedRole,
    language,
    isLoaded,
    isSignedIn,
    name,
    phone,
    village,
    abhaId,
  };
}