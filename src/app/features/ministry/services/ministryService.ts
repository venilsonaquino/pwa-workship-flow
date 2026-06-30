import { showResponseToast } from '@src/lib/toast';
import type { Member } from '../components/MemberRow';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiBandMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string;
  isActive: boolean;
  roleName: string;
  instruments: (string | Instrument)[];
  permissions: string[];
}

export interface ApiBandResponse {
  success: boolean;
  data: {
    name: string;
    inviteCode: string;
    members: ApiBandMember[];
  } | null;
  error: string | null;
}

export interface BandData {
  name: string;
  inviteCode: string;
  members: Member[];
}

export interface Instrument {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface ApiInstrumentsResponse {
  success: boolean;
  data: Instrument[] | null;
  error: string | null;
}


/**
 * Obtém os cabeçalhos de requisição com o token de autorização se disponível.
 */
const getAuthHeaders = (): HeadersInit => {
  const storedAuth = localStorage.getItem('worshipflow_auth_profile');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (storedAuth) {
    try {
      const auth = JSON.parse(storedAuth);
      if (auth?.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }
    } catch {
      // Ignora erro de parsing do token
    }
  }

  return headers;
};

/**
 * Converte um integrante no padrão do backend para o formato do frontend.
 */
const mapApiMemberToMember = (apiMember: ApiBandMember): Member => {
  const mappedInstruments = (apiMember.instruments || [])
    .map((inst) => (typeof inst === 'string' ? inst : inst?.code))
    .filter((code): code is string => typeof code === 'string');

  return {
    id: apiMember.id,
    name: apiMember.name,
    email: apiMember.email,
    phone: apiMember.phone,
    avatarUrl: apiMember.avatarUrl || '',
    isActive: apiMember.isActive,
    instruments: mappedInstruments,
    role: apiMember.roleName as 'admin' | 'member',
    permissions: {
      accountStatus: apiMember.isActive,
      editScales: apiMember.permissions?.includes('EditScales') ?? false,
      adminAccess: apiMember.permissions?.includes('AdminAccess') ?? false,
      manageRepertoire: apiMember.permissions?.includes('ManageRepertoire') ?? false,
    },
  };
};

export const ministryService = {
  async getInstruments(): Promise<Instrument[]> {
    try {
      const response = await fetch(`${BASE_URL}/instruments`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao carregar instrumentos (HTTP ${response.status})`);
        throw new Error(`Erro na API de instrumentos: HTTP ${response.status}`);
      }

      const responseData = (await response.json()) as ApiInstrumentsResponse;
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao processar instrumentos da API');
      }

      return responseData.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede ao buscar instrumentos.');
      throw error;
    }
  },

  /**
   * Obtém as configurações e informações da banda.
   * Contrato API: GET /band
   */
  async getMinistry(): Promise<BandData> {
    try {
      const response = await fetch(`${BASE_URL}/band`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao carregar dados da banda (HTTP ${response.status})`);
        throw new Error(`Erro na API de banda: HTTP ${response.status}`);
      }

      const responseData = (await response.json()) as ApiBandResponse;
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao processar dados da banda da API');
      }

      const bandData = responseData.data;
      const mappedBand: BandData = {
        name: bandData.name,
        inviteCode: bandData.inviteCode,
        members: bandData.members.map(mapApiMemberToMember),
      };

      return mappedBand;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede ao carregar dados da banda.');
      throw error;
    }
  },

  /**
   * Atualiza o nome da banda.
   * Contrato API: PATCH /band
   */
  async updateMinistryName(name: string): Promise<BandData> {
    try {
      const response = await fetch(`${BASE_URL}/band/name`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao atualizar nome da banda (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do nome da banda: HTTP ${response.status}`);
      }

      const responseData = (await response.json()) as { success: boolean; data: boolean; error: string | null };
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao atualizar nome da banda');
      }

      showResponseToast(200, 'Nome da banda atualizado com sucesso!');

      // Busca os dados atualizados dinamicamente do servidor
      return await ministryService.getMinistry();
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }

      showResponseToast(500, 'Erro de rede ao atualizar nome da banda.');
      throw error;
    }
  },

  /**
   * Atualiza ou regera o código de convite da banda.
   * Contrato API: PATCH /band/invite-code
   */
  async updateInviteCode(inviteCode: string): Promise<BandData> {
    try {
      const response = await fetch(`${BASE_URL}/band/invite-code`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao regenerar código de convite (HTTP ${response.status})`);
        throw new Error(`Erro na atualização do código de convite: HTTP ${response.status}`);
      }

      const responseData = (await response.json()) as ApiBandResponse;
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || 'Falha ao atualizar código de convite');
      }

      const bandData = responseData.data;
      const mappedBand: BandData = {
        name: bandData.name,
        inviteCode: bandData.inviteCode,
        members: bandData.members.map(mapApiMemberToMember),
      };

      showResponseToast(200, 'Código de convite regenerado!');
      return mappedBand;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }

      showResponseToast(500, 'Erro de rede ao atualizar código de convite.');
      throw error;
    }
  },

  /**
   * Atualiza os dados de um integrante.
   * Contrato API: PUT /band/members/${memberId}
   */
  async updateMember(
    memberId: string,
    data: { isActive: boolean; instrumentIds: string[]; permissions: string[] }
  ): Promise<BandData> {
    try {
      const response = await fetch(`${BASE_URL}/band/members/${memberId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        showResponseToast(response.status, `Erro ao atualizar integrante (HTTP ${response.status})`);
        throw new Error(`Erro ao atualizar integrante: HTTP ${response.status}`);
      }

      const responseData = (await response.json()) as { success: boolean; data: boolean; error: string | null };
      if (!responseData.success) {
        throw new Error(responseData.error || 'Falha ao atualizar integrante');
      }

      showResponseToast(200, 'Integrante atualizado com sucesso!');
      return await ministryService.getMinistry();
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }

      showResponseToast(500, 'Erro de rede ao atualizar integrante.');
      throw error;
    }
  },
};

export default ministryService;
