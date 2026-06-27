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
 * Hook customizado useProfile.
 * Gerencia o estado de carregamento e atualização do perfil do usuário logado,
 * integrando a camada de serviços com a interface de usuário.
 */
export function useProfile() {
  const { updateAuthProfile } = useAuth();
  
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    isLoading: true,
    isUpdating: false,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
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
        error: message,
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
