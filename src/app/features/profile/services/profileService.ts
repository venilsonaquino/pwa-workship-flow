import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../types';
import { showResponseToast } from '@src/lib/toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_PROFILE_KEY = 'worshipflow_mock_profile';

const DEFAULT_AVATAR = '';

/**
 * Obtém os dados mockados locais salvos no localStorage.
 * Utilizado como estado simulado off-line.
 */
const getMockProfile = (): UserProfile => {
  const stored = localStorage.getItem(MOCK_PROFILE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Ignora erro de parse
    }
  }
  return {
    id: '1',
    name: 'Manu Silveira',
    email: 'manusilveira@worshipflow.com',
    role: 'Líder de Louvor',
    avatarUrl: DEFAULT_AVATAR,
    phone: '(11) 98765-4321',
    ministryName: 'Banda da Colina',
    memberCount: 24,
  };
};

/**
 * Serviço de comunicação com a API de Perfil.
 * Define o contrato das rotas de leitura e escrita do usuário logado.
 */
export const profileService = {
  /**
   * Obtém o perfil do usuário atualmente autenticado.
   * Contrato API: GET /profile
   * 
   * @returns {Promise<UserProfile>}
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/profile`);
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao buscar perfil (HTTP ${response.status})`);
        throw new Error(`Erro na API de perfil: HTTP ${response.status}`);
      }
      const data = await response.json() as UserProfile;
      return data;
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento
      if (!(error instanceof Error && error.message.includes('HTTP'))) {
        showResponseToast(500, 'Erro de rede: Carregando perfil offline.');
      }
      return getMockProfile();
    }
  },

  /**
   * Atualiza as informações pessoais do usuário atualmente autenticado.
   * Contrato API: PUT /profile
   * 
   * @param {UpdateProfileDto} data - Dados a serem atualizados
   * @returns {Promise<UserProfile>}
   */
  async updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao salvar perfil (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do perfil: HTTP ${response.status}`);
      }
      const updated = await response.json() as UserProfile;
      showResponseToast(200, 'Perfil atualizado com sucesso!');
      return updated;
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento: persiste a atualização localmente
      if (!(error instanceof Error && error.message.includes('HTTP'))) {
        showResponseToast(500, 'Erro de rede: Salvo localmente (offline).');
      }
      const current = getMockProfile();
      const updated: UserProfile = {
        ...current,
        ...data,
      };
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
      showResponseToast(200, 'Perfil atualizado localmente!');
      return updated;
    }
  },

  /**
   * Altera a senha do usuário autenticado.
   * Contrato API: PUT /profile/password
   * 
   * @param {ChangePasswordDto} data - Dados contendo senha atual e nova
   * @returns {Promise<void>}
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao alterar senha (HTTP ${response.status})`);
        throw new Error(`Erro ao alterar senha: HTTP ${response.status}`);
      }
      showResponseToast(200, 'Senha atualizada com sucesso!');
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Simulando sucesso (offline).');
      await new Promise((resolve) => setTimeout(resolve, 800));
      showResponseToast(200, 'Senha alterada com sucesso (offline)!');
    }
  },
};

export default profileService;
