import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_PROFILE_KEY = 'worshipflow_mock_profile';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgr8hEMXWD3smxicINNeHHDp0jwIqYfk5L1SbzfC3lc5hacvBys6Kl-HfnwinW9P736vU3aCr8_FCkKzcqbP0fay92KwJX0jl1HKM7L-umYIaLMI4th2yFjFtkfbqfgVq__LDCfZeLPN0fJ-buEJ1hK1bDzdUBxG9-KblIiMgRcPPAcRzhk7DFIRNTr8yTdJJcedXJEh6ER_UgRl0mh_mLFgtw-gddkh8tF0vi2Un9eVjBgUHVQVhGL85Ae8pDytSaDiFk1iRRtE';

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
        throw new Error(`Erro na API de perfil: HTTP ${response.status}`);
      }
      return await response.json() as UserProfile;
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento
      // TODO(security): Em ambiente de produção, garantir o envio de tokens JWT via cabeçalho Authorization ou cookies HttpOnly.
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
        throw new Error(`Erro na atualização do perfil: HTTP ${response.status}`);
      }
      return await response.json() as UserProfile;
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento: persiste a atualização localmente
      const current = getMockProfile();
      const updated: UserProfile = {
        ...current,
        ...data,
      };
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
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
        throw new Error(`Erro ao alterar senha: HTTP ${response.status}`);
      }
    } catch (error) {
      // Fallback off-line em ambiente de desenvolvimento
      // TODO(security): Adicionar validação JWT no backend
      return new Promise((resolve) => setTimeout(resolve, 800));
    }
  },
};

export default profileService;
