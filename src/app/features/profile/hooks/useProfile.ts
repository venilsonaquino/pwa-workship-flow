import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, UpdateProfileDto } from '../types';
import { profileService } from '../services/profileService';
import { useAuth } from '@shared/hooks/useAuth';

interface UseProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

/**
 * Recupera os dados do usuário autenticado a partir da sessão ativa (Cache-First).
 * Evita telas de carregamento bloqueantes se o usuário já estiver logado.
 */
const getSessionCachedProfile = (): UserProfile | null => {
  const storedAuth = localStorage.getItem('worshipflow_auth_profile');
  if (storedAuth) {
    try {
      const auth = JSON.parse(storedAuth);
      if (auth.isAuthenticated) {
        return {
          id: auth.id || '',
          name: auth.userName || '',
          email: auth.userEmail || '',
          role: auth.userRole,
          avatarUrl: auth.avatarUrl || '',
          phone: '',
          memberCount: 0,
        };
      }
    } catch {
      // Ignora erro de parse
    }
  }
  return null;
};

/**
 * Hook customizado useProfile.
 * Gerencia o estado de carregamento e atualização do perfil do usuário logado,
 * integrando a camada de serviços com a interface de usuário.
 */
export function useProfile() {
  const { updateAuthProfile } = useAuth();

  const initialProfile = getSessionCachedProfile();

  const [state, setState] = useState<UseProfileState>({
    profile: initialProfile,
    isLoading: !initialProfile, // Só exibe loading se não houver sessão ativa em cache
    isUpdating: false,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: !prev.profile,
      error: null
    }));

    try {
      const data = await profileService.getProfile();
      setState((prev) => ({
        ...prev,
        profile: data,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: prev.profile ? null : message,
      }));
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileDto): Promise<UserProfile | null> => {
    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const updated = await profileService.updateProfile(data);

      setState((prev) => ({
        ...prev,
        profile: updated,
        isUpdating: false,
      }));

      // Sincroniza as informações de autenticação se nome, e-mail ou avatar mudarem
      updateAuthProfile({
        userName: updated.name,
        userEmail: updated.email,
        avatarUrl: updated.avatarUrl,
        userRole: updated.role as any,
      });

      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setState((prev) => ({
        ...prev,
        isUpdating: false,
        error: message,
      }));
      return null;
    }
  }, [updateAuthProfile]);

  // Carrega o perfil automaticamente ao montar o componente
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile: state.profile,
    isLoading: state.isLoading,
    isUpdating: state.isUpdating,
    error: state.error,
    fetchProfile,
    updateProfile,
  };
}

export default useProfile;
