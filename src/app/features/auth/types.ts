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
