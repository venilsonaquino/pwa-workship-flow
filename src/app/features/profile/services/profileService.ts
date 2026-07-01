import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../types';
import { showResponseToast } from '@src/lib/toast';
import { getAbsoluteAvatarUrl } from '@src/lib/utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Obtém os cabeçalhos de requisição com o token de autorização se disponível.
 */
const getAuthHeaders = (contentType?: string | null): HeadersInit => {
  const stored = localStorage.getItem('worshipflow_auth_profile');
  const headers: Record<string, string> = {};
  
  if (contentType !== null) {
    headers['Content-Type'] = contentType || 'application/json';
  }

  if (!stored) {
    return headers;
  }

  try {
    const auth = JSON.parse(stored);
    if (auth?.token) {
      headers['Authorization'] = `Bearer ${auth.token}`;
    }
  } catch {
    // Ignora erro de parse
  }

  return headers;
};

interface ApiUserMeResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string;
    roleName: string;
    membersCount: number;
    permissions?: string[];
  };
  error: string | null;
}

/**
 * Serviço de comunicação com a API de Perfil.
 * Define o contrato das rotas de leitura e escrita do usuário logado.
 */
export const profileService = {
  /**
   * Obtém o perfil do usuário atualmente autenticado.
   * Contrato API: GET /users/me
   * 
   * @returns {Promise<UserProfile>}
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao buscar perfil (HTTP ${response.status})`);
        throw new Error(`Erro na API de perfil: HTTP ${response.status}`);
      }
      const responseData = await response.json() as ApiUserMeResponse;
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao processar dados de perfil da API');
      }

      const apiUser = responseData.data;
      return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.roleName || 'Líder de Louvor',
        avatarUrl: getAbsoluteAvatarUrl(apiUser.avatarUrl),
        phone: apiUser.phone || '',
        memberCount: apiUser.membersCount || 0,
        permissions: apiUser.permissions || [],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Não foi possível obter o perfil.');
      throw error;
    }
  },

  /**
   * Atualiza as informações pessoais do usuário atualmente autenticado.
   * Contrato API: PUT /users/me
   * 
   * @param {UpdateProfileDto} data - Dados a serem atualizados
   * @returns {Promise<UserProfile>}
   */
  async updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao salvar perfil (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do perfil: HTTP ${response.status}`);
      }
      const responseData = await response.json() as ApiUserMeResponse;
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao processar dados de perfil da API');
      }

      const apiUser = responseData.data;
      showResponseToast(200, 'Perfil atualizado com sucesso!');
      return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.roleName || 'Líder de Louvor',
        avatarUrl: getAbsoluteAvatarUrl(apiUser.avatarUrl),
        phone: apiUser.phone || '',
        memberCount: apiUser.membersCount || 0,
        permissions: apiUser.permissions || [],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Não foi possível atualizar o perfil.');
      throw error;
    }
  },

  /**
   * Altera a senha do usuário autenticado.
   * Contrato API: PUT /users/me/password
   * 
   * @param {ChangePasswordDto} data - Dados contendo senha atual e nova
   * @returns {Promise<void>}
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = `Erro ao alterar senha (HTTP ${response.status})`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMessage = errData.error;
          }
        } catch {
          // Ignora erro se o JSON da resposta for inválido
        }
        showResponseToast(response.status, errorMessage);
        throw new Error(errorMessage);
      }
      showResponseToast(200, 'Senha atualizada com sucesso!');
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Não foi possível alterar a senha.');
      throw error;
    }
  },

  /**
   * Atualiza a imagem de avatar do usuário atualmente autenticado.
   * Contrato API: PATCH /users/me/avatar
   * 
   * @param {File} file - Arquivo de imagem do avatar (máx 16MB)
   * @returns {Promise<string>} - A nova URL do avatar
   */
  async updateAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = getAuthHeaders(null);
      const response = await fetch(`${BASE_URL}/users/me/avatar`, {
        method: 'PATCH',
        headers,
        body: formData,
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao atualizar avatar (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do avatar: HTTP ${response.status}`);
      }

      interface ApiAvatarResponse {
        success: boolean;
        data: {
          avatarUrl: string;
        };
        error: string | null;
      }

      const responseData = await response.json() as ApiAvatarResponse;
      
      const isResponseInvalid = !responseData.success || !responseData.data || !responseData.data.avatarUrl;
      if (isResponseInvalid) {
        throw new Error(responseData.error || 'Falha ao processar resposta do upload de avatar');
      }

      showResponseToast(200, 'Avatar atualizado com sucesso!');
      return getAbsoluteAvatarUrl(responseData.data.avatarUrl);
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Não foi possível atualizar o avatar.');
      throw error;
    }
  },
};

export default profileService;
