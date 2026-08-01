import { useState, useEffect, useCallback } from 'react';
import { getAbsoluteAvatarUrl } from '@src/lib/utils';

export type UserRole = 'Admin' | 'Member';

export const Permission = {
  AdminAccess: 'AdminAccess',
  ScaleView: 'ScaleView',
  SongView: 'SongView',
  SongViewEngagement: 'SongViewEngagement',
  SongViewListeners: 'SongViewListeners',
  SongEditColumns: 'SongEditColumns',
  RankingView: 'RankingView',
  MinistryManage: 'MinistryManage',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

export interface UserProfile {
  isAuthenticated: boolean;
  userId?: string;
  userName: string;
  userEmail: string;
  userRole: UserRole | null;
  avatarUrl: string;
  token?: string;
  ministryName?: string;
  permissions?: Permission[];
}

const AUTH_KEY = 'worshipflow_auth_profile';
const DEFAULT_AVATAR = '';

function getUserIdFromToken(token?: string): string | undefined {
  if (!token) return undefined;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return undefined;
    const payload = JSON.parse(atob(parts[1]));
    return payload.nameid || payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  } catch {
    return undefined;
  }
}

const getInitialState = (): UserProfile => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      if (!parsed.userId && parsed.token) {
        parsed.userId = getUserIdFromToken(parsed.token);
      }
      return parsed;
    } catch {
      // Ignore parse issues
    }
  }
  return {
    isAuthenticated: false,
    userName: '',
    userEmail: '',
    userRole: null,
    avatarUrl: '',
    permissions: [],
  };
};

let _authStore: UserProfile = getInitialState();
const _subscribers = new Set<() => void>();

function notifySubscribers() {
  console.log('[useAuth] Notifying subscribers, count:', _subscribers.size);
  _subscribers.forEach((cb) => cb());
}

/**
 * Hook useAuth
 * Gerenciador reativo e persistente de estado para simular a autenticação do usuário.
 */
export function useAuth() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => {
      console.log('[useAuth] Rerendering component due to auth changes!');
      forceRender((n) => n + 1);
    };
    _subscribers.add(rerender);
    console.log('[useAuth] Subscribed new component. Total count:', _subscribers.size);
    return () => {
      _subscribers.delete(rerender);
      console.log('[useAuth] Unsubscribed component. Total count:', _subscribers.size);
    };
  }, []);

  const hasPermission = useCallback((requiredPermission: Permission): boolean => {
    if (!_authStore.isAuthenticated) {
      return false;
    }
    if (_authStore.userRole === 'Admin') {
      return true;
    }
    const userPermissions = _authStore.permissions;
    if (!userPermissions) {
      return false;
    }
    if (userPermissions.includes(Permission.AdminAccess)) {
      return true;
    }
    return userPermissions.includes(requiredPermission);
  }, []);

  const login = useCallback((
    roleName: UserRole,
    customName?: string,
    customEmail?: string,
    token?: string,
    ministryName?: string,
    avatarUrl?: string,
    permissions?: Permission[],
    userId?: string
  ) => {
    const resolvedUserId = userId || getUserIdFromToken(token);
    const userProfile: UserProfile = {
      isAuthenticated: true,
      userId: resolvedUserId,
      userName: customName || '',
      userEmail: customEmail || '',
      userRole: roleName,
      avatarUrl: getAbsoluteAvatarUrl(avatarUrl || DEFAULT_AVATAR),
      token,
      ministryName,
      permissions: permissions || [],
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userProfile));
    _authStore = userProfile;
    notifySubscribers();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('worshipflow_mock_profile');
    localStorage.removeItem('worshipflow_mock_ministry');
    _authStore = {
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      userRole: null,
      avatarUrl: '',
      permissions: [],
    };
    notifySubscribers();
  }, []);

  const updateAuthProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = { ..._authStore, ...updates };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    _authStore = updated;
    notifySubscribers();
  }, []);

  return {
    ..._authStore,
    hasPermission,
    login,
    logout,
    updateAuthProfile,
  };
}
