import type { LeaderSignupDto, LeaderSignupResponse } from '../types';
import { showResponseToast } from '@src/lib/toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async registerLeader(signupData: LeaderSignupDto): Promise<LeaderSignupResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register/leader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      if (!response.ok) {
        showResponseToast(response.status, `Erro ao cadastrar líder (HTTP ${response.status})`);
        throw new Error(`Erro no cadastro de líder: HTTP ${response.status}`);
      }
      const result = await response.json() as LeaderSignupResponse;
      showResponseToast(201, result.message);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede ao tentar cadastrar líder.');
      throw error;
    }
  },
};

export default authService;

