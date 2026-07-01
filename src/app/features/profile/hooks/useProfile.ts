import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, UpdateProfileDto } from '../types';
import { profileService } from '../services/profileService';
import { useAuth, type UserRole } from '@shared/hooks/useAuth';

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
          permissions: auth.permissions || [],
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
      // Sincroniza as informações de autenticação com os dados reais/mais recentes do perfil
      updateAuthProfile({
        userName: data.name,
        userEmail: data.email,
        avatarUrl: data.avatarUrl,
        userRole: data.role as UserRole,
        permissions: data.permissions,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: prev.profile ? null : message,
      }));
    }
  }, [updateAuthProfile]);

  const updateProfile = useCallback(async (data: UpdateProfileDto): Promise<UserProfile | null> => {
    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      let avatarUrl = data.avatarUrl;

      if (data.avatarFile) {
        const uploadedUrl = await profileService.updateAvatar(data.avatarFile);
        // Adiciona um parâmetro de tempo para evitar cache do navegador (cache-busting)
        avatarUrl = `${uploadedUrl}?t=${Date.now()}`;
      }

      const profilePayload: UpdateProfileDto = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      if (avatarUrl) {
        profilePayload.avatarUrl = avatarUrl;
      }

      const updated = await profileService.updateProfile(profilePayload);

      // Preserva a URL do avatar (com o cache-busting) no estado local e de autenticação,
      // pois o endpoint genérico de atualização de perfil (PUT /users/me) pode não retornar
      // ou retornar de forma desatualizada a imagem modificada no PATCH.
      if (avatarUrl) {
        updated.avatarUrl = avatarUrl;
      }

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
        userRole: updated.role as UserRole,
        permissions: updated.permissions,
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
    Promise.resolve().then(() => {
      fetchProfile();
    });
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
