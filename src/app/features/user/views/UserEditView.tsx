import React from 'react';
import { UserForm } from '../components/UserForm';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { User, CreateUserDto } from '../types';

interface UserEditViewProps {
  user?: User;
}

const mockUser: User = {
  id: '1',
  name: 'Ana Beatriz Costa',
  email: 'ana.costa@email.com',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-06-01T08:30:00Z',
};

export const UserEditView: React.FC<UserEditViewProps> = ({ user = mockUser }) => {
  const { updateUser, isLoading, error } = useUpdateUser();

  const handleSubmit = async (data: CreateUserDto) => {
    const updated = await updateUser(user.id, data);
    if (updated) {
      console.info('[UserEditView] User updated:', updated);
      history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-background">
      <div className="w-full max-w-md flex flex-col gap-2">
        <h2 className="text-2xl text-secondary font-bold text-left">Editar Usuário</h2>
        <p className="text-placeholder text-sm text-left mb-4">
          Modifique os campos abaixo para atualizar as informações do usuário.
        </p>
      </div>

      {error && (
        <div className="w-full max-w-md p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg text-left">
          {error}
        </div>
      )}

      <UserForm
        initialValues={user}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Salvar Alterações"
        onCancel={() => history.back()}
      />
    </div>
  );
};

export default UserEditView;
