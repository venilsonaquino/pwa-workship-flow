import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'Líder de Louvor' | 'Integrante';

export interface UserProfile {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userRole: UserRole | null;
  avatarUrl: string;
}

const AUTH_KEY = 'worshipflow_auth_profile';
const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgr8hEMXWD3smxicINNeHHDp0jwIqYfk5L1SbzfC3lc5hacvBys6Kl-HfnwinW9P736vU3aCr8_FCkKzcqbP0fay92KwJX0jl1HKM7L-umYIaLMI4th2yFjFtkfbqfgVq__LDCfZeLPN0fJ-buEJ1hK1bDzdUBxG9-KblIiMgRcPPAcRzhk7DFIRNTr8yTdJJcedXJEh6ER_UgRl0mh_mLFgtw-gddkh8tF0vi2Un9eVjBgUHVQVhGL85Ae8pDytSaDiFk1iRRtE';

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
  _subscribers.forEach((cb) => cb());
}

/**
 * Hook useAuth
 * Gerenciador reativo e persistente de estado para simular a autenticação do usuário.
 */
export function useAuth() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((n) => n + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  const login = useCallback((role: UserRole, customName?: string, customEmail?: string) => {
    const mockUser: UserProfile = {
      isAuthenticated: true,
      userName: customName || (role === 'Líder de Louvor' ? 'Manu Silveira' : 'Gabriel Lima'),
      userEmail: customEmail || (role === 'Líder de Louvor' ? 'manusilveira@worshipflow.com' : 'gabriellima@worshipflow.com'),
      userRole: role,
      avatarUrl: DEFAULT_AVATAR,
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

