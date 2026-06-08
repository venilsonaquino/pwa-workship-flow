import React, { useState } from 'react';
import type { CreateUserDto, User, UserRole, UserStatus } from '../types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';

interface UserFormProps {
  initialValues?: User;
  onSubmit: (data: CreateUserDto) => void;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Salvar',
  onCancel,
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [role, setRole] = useState<UserRole>(initialValues?.role ?? 'viewer');
  const [status, setStatus] = useState<UserStatus>(initialValues?.status ?? 'active');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido');
      valid = false;
    } else {
      setEmailError('');
    }

    if (valid) {
      onSubmit({ name, email, role, status });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 text-left">
      <Input
        label="Nome Completo"
        placeholder="Ex: João Silva"
        value={name}
        onChange={(e) => setName(e.target.value)}
        errorMessage={nameError}
        disabled={isLoading}
      />

      <Input
        label="E-mail"
        placeholder="Ex: joao.silva@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errorMessage={emailError}
        disabled={isLoading}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-on-surface">Função (Cargo)</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          disabled={isLoading}
          className="flex items-center bg-surface border border-border rounded-lg px-3 min-h-[48px] text-on-surface text-base outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all duration-150"
        >
          <option value="viewer">Visualizador</option>
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-on-surface">Status da Conta</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as UserStatus)}
          disabled={isLoading}
          className="flex items-center bg-surface border border-border rounded-lg px-3 min-h-[48px] text-on-surface text-base outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all duration-150"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isLoading} type="button">
            Cancelar
          </Button>
        )}
        <Button variant="primary" isLoading={isLoading} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
