import { Permission } from '@shared/hooks/useAuth';

/**
 * DTO para o cadastro de um novo Líder de Louvor.
 */
export interface LeaderSignupDto {
  /** Nome completo do líder de louvor */
  name: string;

  /** Endereço de e-mail profissional */
  email: string;

  /** Nome da banda ou ministério que será criado */
  bandName: string;

  /** Senha de acesso do usuário */
  password: string;
}

/**
 * Representa o contrato de resposta de sucesso após o cadastro do líder de louvor.
 */
export interface LeaderSignupResponse {
  /** Mensagem de sucesso retornada pelo servidor */
  success: boolean;
  message: string;
  status: number;
}

/**
 * DTO contendo as credenciais para autenticação de login.
 */
export interface LoginCredentialsDto {
  /** Endereço de e-mail cadastrado */
  email: string;

  /** Senha de acesso do usuário */
  password: string;
}

export interface LoginResponse {
  /** Indica se a operação foi realizada com sucesso */
  success: boolean;

  /** Mensagem descritiva retornada pelo servidor */
  message: string;

  /** Código de status HTTP */
  status: number;

  /** Token de sessão JWT */
  token?: string;

  /** Dados resumidos do usuário autenticado */
  user?: {
    id?: string;
    name: string;
    email: string;
    roleName?: string;
    avatarUrl?: string;
    ministryName?: string;
    permissions?: Permission[];
  };
}

/**
 * DTO para o cadastro de um novo Integrante.
 */
export interface MemberSignupDto {
  /** Nome completo do integrante */
  name: string;

  /** Endereço de e-mail */
  email: string;

  /** Senha de acesso do usuário */
  password: string;

  /** Código de acesso da banda/ministério (sem hífen) */
  bandCode: string;
}

/**
 * Representa o contrato de resposta de sucesso após o cadastro do integrante.
 */
export interface MemberSignupResponse {
  /** Indica se a operação foi realizada com sucesso */
  success: boolean;
  message: string;
  status: number;
}

