/**
 * CONTRATO DA API - RECURSO DE PERFIL (PROFILE)
 * 
 * Este arquivo define o contrato de dados entre o Frontend e o Backend
 * para o recurso de Perfil do Usuário Autenticado (/profile ou /users/me).
 */

/**
 * Representa o recurso completo de Perfil de Usuário.
 * Retornado por: GET /profile
 */
export interface UserProfile {
  /** Identificador único do usuário */
  id: string;
  
  /** Nome completo do usuário */
  name: string;
  
  /** Endereço de e-mail primário */
  email: string;
  
  /** Papel/Função do usuário no sistema (Ex: "Líder de Louvor", "Integrante", etc.) */
  role: string;
  
  /** URL pública da imagem de avatar do usuário */
  avatarUrl: string;
  
  /** Número de telefone para contato (opcional) */
  phone?: string;
  
  /** Nome do ministério ao qual o usuário pertence (opcional) */
  ministryName?: string;
  
  /** Quantidade total de integrantes do ministério (opcional) */
  memberCount?: number;

  /** Permissões associadas ao usuário (opcional) */
  permissions?: string[];
}

/**
 * Payload de dados enviado para atualizar o perfil do usuário logado.
 * Enviado por: PUT /profile ou PATCH /profile
 */
export interface UpdateProfileDto {
  /** Novo nome completo (opcional) */
  name?: string;
  
  /** Novo e-mail de contato (opcional) */
  email?: string;
  
  /** Novo telefone para contato (opcional) */
  phone?: string;
  
  /** Nova URL para imagem de avatar (opcional) */
  avatarUrl?: string;

  /** Novo arquivo de imagem de avatar a ser enviado (opcional) */
  avatarFile?: File;
}

/**
 * Payload de dados para alteração de senha de usuário.
 */
export interface ChangePasswordDto {
  /** Senha atual (para validação) */
  currentPassword?: string;
  
  /** Nova senha desejada */
  newPassword?: string;

  /** Confirmação da nova senha desejada */
  confirmNewPassword?: string;
}

