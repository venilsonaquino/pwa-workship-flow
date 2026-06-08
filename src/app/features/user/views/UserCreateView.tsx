import React from 'react';
import { UserForm } from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import type { CreateUserDto } from '../types';

export const UserCreateView: React.FC = () => {
  const { createUser, isLoading, error } = useCreateUser();

  const handleSubmit = async (data: CreateUserDto) => {
    const newUser = await createUser(data);
    if (newUser) {
      console.info('[UserCreateView] User created:', newUser);
      history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-background">
      <div className="w-full max-w-md flex flex-col gap-2">
        <h2 className="text-2xl text-primary font-bold text-left">Criar Usuário</h2>
        <p className="text-placeholder text-sm text-left mb-4">
          Preencha os dados abaixo para cadastrar um novo usuário no sistema.
        </p>
      </div>

      {error && (
        <div className="w-full max-w-md p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg text-left">
          {error}
        </div>
      )}

      <UserForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Criar Usuário"
        onCancel={() => history.back()}
      />
    </div>
  );
};

export default UserCreateView;
