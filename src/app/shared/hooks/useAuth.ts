import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'Líder de Louvor' | 'Integrante';

export interface UserProfile {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userRole: UserRole | null;
  avatarUrl: string;
  token?: string;
  ministryName?: string;
}

const AUTH_KEY = 'worshipflow_auth_profile';
const DEFAULT_AVATAR = '';

const getInitialState = (): UserProfile => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
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

  const login = useCallback((
    role: UserRole,
    customName?: string,
    customEmail?: string,
    token?: string,
    ministryName?: string
  ) => {
    const mockUser: UserProfile = {
      isAuthenticated: true,
      userName: customName || (role === 'Líder de Louvor' ? 'Manu Silveira' : 'Gabriel Lima'),
      userEmail: customEmail || (role === 'Líder de Louvor' ? 'manusilveira@worshipflow.com' : 'gabriellima@worshipflow.com'),
      userRole: role,
      avatarUrl: DEFAULT_AVATAR,
      token,
      ministryName,
    };
    
    // Nota: Armazenando apenas preferências fictícias não sensíveis localmente.
    // TODO(security): Implementar cookies HttpOnly e SameSite para gerenciar sessões reais no servidor.
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    _authStore = mockUser;
    notifySubscribers();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    _authStore = {
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      userRole: null,
      avatarUrl: '',
    };
    notifySubscribers();
  }, []);

  const updateAuthProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = { ..._authStore, ...updates };
    // TODO(security): Implement safe session token cookies on the server-side instead of localStorage in prod.
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    _authStore = updated;
    notifySubscribers();
  }, []);

  return {
    ..._authStore,
    login,
    logout,
    updateAuthProfile,
  };
}

