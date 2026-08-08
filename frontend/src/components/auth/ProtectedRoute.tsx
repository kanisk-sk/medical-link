import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { AuthLoading } from './AuthLoading';
import { useAuthStore } from '../../store/authStore';
import { canAccessPathForRole, normalizeAppPath, resolvePostAuthPath } from '../../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isLoaded, isSignedIn: clerkSignedIn } = useAuth();
  const { user } = useUser();

  const isDemoUser = useAuthStore((state) => state.isDemoUser);
  const demoRole = useAuthStore((state) => state.demoRole);

  const effectiveSignedIn = clerkSignedIn || isDemoUser;
  const effectiveUserId = isDemoUser ? 'demo_dummy_user' : (user?.id ?? null);
  const selectedRole = isDemoUser
    ? (demoRole || 'patient')
    : useAuthStore((state) => state.getSelectedRole(effectiveUserId));

  if (!isLoaded && !isDemoUser) {
    return <AuthLoading />;
  }

  if (!effectiveSignedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const normalizedPath = normalizeAppPath(location.pathname);

  if (!selectedRole && normalizedPath !== '/select-role') {
    return <Navigate to="/select-role" replace state={{ from: location }} />;
  }

  if (selectedRole && !canAccessPathForRole(normalizedPath, selectedRole)) {
    return <Navigate to={resolvePostAuthPath(selectedRole, location.pathname)} replace />;
  }

  return <>{children}</>;
};