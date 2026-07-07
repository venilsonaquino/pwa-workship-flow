import type { LeaderSignupDto, LeaderSignupResponse, LoginCredentialsDto, LoginResponse, MemberSignupDto, MemberSignupResponse } from '../types';
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

  async registerMember(signupData: MemberSignupDto): Promise<MemberSignupResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register/member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      if (!response.ok) {
        let errorMessage = `Erro ao cadastrar integrante (HTTP ${response.status})`;
        try {
          const errorData = await response.json() as MemberSignupResponse;
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignora falha de parse
        }
        showResponseToast(response.status, errorMessage);
        throw new Error(errorMessage);
      }
      const result = await response.json() as MemberSignupResponse;
      showResponseToast(201, result.message);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede ao tentar cadastrar integrante.');
      throw error;
    }
  },

  async login(credentials: LoginCredentialsDto): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        let errorMessage = `Erro ao fazer login (HTTP ${response.status})`;
        try {
          const errorData = await response.json() as LoginResponse;
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignora falha de parse
        }
        showResponseToast(response.status, errorMessage);
        throw new Error(errorMessage);
      }
      const result = await response.json() as LoginResponse;
      showResponseToast(200, result.message || 'Login realizado com sucesso!');
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP')) {
        throw error;
      }
      showResponseToast(500, 'Erro de rede ao tentar fazer login.');
      throw error;
    }
  },
};

export default authService;

