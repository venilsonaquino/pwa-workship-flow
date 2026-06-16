const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_MINISTRY_KEY = 'worshipflow_mock_ministry';
const MOCK_PROFILE_KEY = 'worshipflow_mock_profile';
import { showResponseToast } from '@src/lib/toast';

export interface MinistryData {
  name: string;
  inviteCode: string;
}

/**
 * Obtém o nome da banda armazenado no localStorage do perfil para manter consistência.
 */
const getMockProfileMinistryName = (): string => {
  const profileStored = localStorage.getItem(MOCK_PROFILE_KEY);
  if (profileStored) {
    try {
      const profile = JSON.parse(profileStored);
      if (profile.ministryName) return profile.ministryName;
    } catch {
      // Ignora erro
    }
  }
  return 'Banda da Colina';
};

/**
 * Atualiza o nome da banda no localStorage do perfil.
 */
const updateMockProfileMinistryName = (newName: string) => {
  const profileStored = localStorage.getItem(MOCK_PROFILE_KEY);
  if (profileStored) {
    try {
      const profile = JSON.parse(profileStored);
      profile.ministryName = newName;
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignora erro
    }
  }
};

/**
 * Obtém os dados mockados locais salvos no localStorage.
 */
const getMockMinistry = (): MinistryData => {
  const stored = localStorage.getItem(MOCK_MINISTRY_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored) as MinistryData;
      // Garante sincronização com o nome do perfil
      data.name = getMockProfileMinistryName();
      return data;
    } catch {
      // Ignora erro de parse
    }
  }
  return {
    name: getMockProfileMinistryName(),
    inviteCode: 'WORSHIP-X7K2',
  };
};

/**
 * Serviço de comunicação com a API do Ministério.
 */
export const ministryService = {
  /**
   * Obtém as configurações e informações da banda/ministério.
   * Contrato API: GET /ministry
   */
  async getMinistry(): Promise<MinistryData> {
    try {
      const response = await fetch(`${BASE_URL}/ministry`);
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao carregar dados da banda (HTTP ${response.status})`);
        throw new Error(`Erro na API de ministério: HTTP ${response.status}`);
      }
      const data = await response.json() as MinistryData;
      return data;
    } catch (error) {
      // Fallback off-line em desenvolvimento
      if (!(error instanceof Error && error.message.includes('HTTP'))) {
        showResponseToast(500, 'Erro de rede: Carregando dados locais da banda.');
      }
      return getMockMinistry();
    }
  },

  /**
   * Atualiza o nome da banda.
   * Contrato API: PATCH /ministry
   */
  async updateMinistryName(name: string): Promise<MinistryData> {
    try {
      const response = await fetch(`${BASE_URL}/ministry`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao atualizar nome da banda (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do nome da banda: HTTP ${response.status}`);
      }
      const data = await response.json() as MinistryData;
      showResponseToast(200, 'Nome da banda atualizado com sucesso!');
      return data;
    } catch (error) {
      // Fallback off-line em desenvolvimento
      if (!(error instanceof Error && error.message.includes('HTTP'))) {
        showResponseToast(500, 'Erro de rede: Nome atualizado localmente.');
      }
      const current = getMockMinistry();
      const updated: MinistryData = {
        ...current,
        name,
      };
      localStorage.setItem(MOCK_MINISTRY_KEY, JSON.stringify(updated));
      updateMockProfileMinistryName(name); // Sincroniza com perfil
      showResponseToast(200, 'Nome da banda salvo localmente!');
      return updated;
    }
  },

  /**
   * Atualiza ou regera o código de convite da banda.
   * Contrato API: PATCH /ministry/invite-code
   */
  async updateInviteCode(inviteCode: string): Promise<MinistryData> {
    try {
      const response = await fetch(`${BASE_URL}/ministry/invite-code`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao regenerar código de convite (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do código de convite: HTTP ${response.status}`);
      }
      const data = await response.json() as MinistryData;
      showResponseToast(200, 'Código de convite regenerado!');
      return data;
    } catch (error) {
      // Fallback off-line em desenvolvimento
      if (!(error instanceof Error && error.message.includes('HTTP'))) {
        showResponseToast(500, 'Erro de rede: Código de convite salvo localmente.');
      }
      const current = getMockMinistry();
      const updated: MinistryData = {
        ...current,
        inviteCode,
      };
      localStorage.setItem(MOCK_MINISTRY_KEY, JSON.stringify(updated));
      showResponseToast(200, 'Código de convite atualizado localmente!');
      return updated;
    }
  },
};

export default ministryService;
