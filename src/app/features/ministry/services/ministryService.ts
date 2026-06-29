import { showResponseToast } from '@src/lib/toast';
import type { Member } from '../components/MemberRow';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_BAND_KEY = 'worshipflow_mock_band';

export interface ApiBandMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string;
  status: string;
  roleName: string;
  instruments: string[];
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
  const isActive = apiMember.status === 'active';
  
  let rolesString = 'Nenhum';
  if (apiMember.instruments && apiMember.instruments.length > 0) {
    rolesString = apiMember.instruments
      .map((instrument) => instrument.charAt(0).toUpperCase() + instrument.slice(1))
      .join(', ');
  }

  const roleType = apiMember.roleName?.toLowerCase() === 'admin' ? 'admin' : 'member';

  return {
    id: apiMember.id,
    name: apiMember.name,
    avatarUrl: apiMember.avatarUrl || '',
    isActive,
    roles: rolesString,
    role: roleType,
    permissions: {
      accountStatus: isActive,
      editScales: apiMember.permissions?.includes('EditScales') ?? false,
      manageRepertoire: apiMember.permissions?.includes('ManageRepertoire') ?? false,
      adminAccess: apiMember.permissions?.includes('AdminAccess') ?? false,
    },
  };
};

/**
 * Obtém os dados de fallback mockados locais do localStorage.
 */
const getMockBand = (): BandData => {
  const storedBand = localStorage.getItem(MOCK_BAND_KEY);
  if (storedBand) {
    try {
      return JSON.parse(storedBand) as BandData;
    } catch {
      // Ignora erro de parsing
    }
  }
  
  const defaultBand: BandData = {
    name: 'Banda da Colina',
    inviteCode: 'WORSHIP-X7K2',
    members: [
      {
        id: '1',
        name: 'Manu',
        avatarUrl: '',
        isActive: true,
        roles: 'Teclado',
        role: 'admin',
        permissions: {
          accountStatus: true,
          editScales: true,
          manageRepertoire: true,
          adminAccess: true,
        },
      },
      {
        id: '2',
        name: 'Gabriel Santos',
        avatarUrl: '',
        isActive: true,
        roles: 'Vocal',
        role: 'member',
        permissions: {
          accountStatus: true,
          editScales: true,
          manageRepertoire: true,
          adminAccess: false,
        },
      },
      {
        id: '3',
        name: 'Ana Oliveira',
        avatarUrl: '',
        isActive: true,
        roles: 'Vocal',
        role: 'member',
        permissions: {
          accountStatus: true,
          editScales: false,
          manageRepertoire: false,
          adminAccess: false,
        },
      },
      {
        id: '4',
        name: 'Lucas Ferreira',
        avatarUrl: '',
        isActive: false,
        roles: 'Bateria',
        role: 'member',
        permissions: {
          accountStatus: false,
          editScales: false,
          manageRepertoire: false,
          adminAccess: false,
        },
      },
    ],
  };
  
  localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(defaultBand));
  return defaultBand;
};

/**
 * Serviço de comunicação com a API de Banda/Ministério.
 */
export const ministryService = {
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

      localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(mappedBand));
      return mappedBand;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede: Carregando dados locais da banda.');
      return getMockBand();
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
      
      const currentBand = getMockBand();
      const updatedBand: BandData = {
        ...currentBand,
        name,
      };
      localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(updatedBand));
      return updatedBand;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      
      showResponseToast(500, 'Erro de rede: Nome atualizado localmente.');
      const currentBand = getMockBand();
      const updatedBand: BandData = {
        ...currentBand,
        name,
      };
      localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(updatedBand));
      return updatedBand;
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
      localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(mappedBand));
      return mappedBand;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      
      showResponseToast(500, 'Erro de rede: Código de convite salvo localmente.');
      const currentBand = getMockBand();
      const updatedBand: BandData = {
        ...currentBand,
        inviteCode,
      };
      localStorage.setItem(MOCK_BAND_KEY, JSON.stringify(updatedBand));
      return updatedBand;
    }
  },
};

export default ministryService;
