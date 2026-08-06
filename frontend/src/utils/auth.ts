import { SehatLinkRole } from '../types';

export const ROLE_HOME_PATHS: Record<SehatLinkRole, string> = {
  patient: '/patient/home',
  doctor: '/doctor/dashboard',
  health_worker: '/worker/dashboard',
  pharmacist: '/pharmacy/dashboard',
  admin: '/admin/dashboard',
};

const LEGACY_PATH_ALIASES: Record<string, string> = {
  '/home': ROLE_HOME_PATHS.patient,
  '/symptom-capture': '/patient/symptom-capture',
  '/assisted-intake': ROLE_HOME_PATHS.health_worker,
  '/triage': '/patient/triage',
  '/doctor-dashboard': ROLE_HOME_PATHS.doctor,
  '/consultation': '/patient/consultation',
  '/prescription-view': '/patient/prescription-view',
  '/pharmacy': ROLE_HOME_PATHS.pharmacist,
  '/admin': ROLE_HOME_PATHS.admin,
  '/emergency': '/patient/emergency',
  '/settings': '/patient/settings',
};

export function getRoleHomePath(role?: SehatLinkRole | null) {
  if (!role) {
    return '/select-role';
  }

  return ROLE_HOME_PATHS[role];
}

export function normalizeAppPath(pathname: string) {
  return LEGACY_PATH_ALIASES[pathname] ?? pathname;
}

export function canAccessPathForRole(pathname: string, role?: SehatLinkRole | null) {
  if (!role) {
    return false;
  }

  const normalizedPath = normalizeAppPath(pathname);

  switch (role) {
    case 'patient':
      return normalizedPath.startsWith('/patient/');
    case 'doctor':
      return normalizedPath.startsWith('/doctor/');
    case 'health_worker':
      return normalizedPath.startsWith('/worker/');
    case 'pharmacist':
      return normalizedPath.startsWith('/pharmacy/');
    case 'admin':
      return normalizedPath.startsWith('/admin/');
    default:
      return false;
  }
}

export function resolvePostAuthPath(role: SehatLinkRole, requestedPath?: string | null) {
  if (requestedPath && canAccessPathForRole(requestedPath, role)) {
    return normalizeAppPath(requestedPath);
  }

  return getRoleHomePath(role);
}

export function isRoleHomePath(pathname: string, role?: SehatLinkRole | null) {
  if (!role) {
    return false;
  }

  return normalizeAppPath(pathname) === ROLE_HOME_PATHS[role];
}