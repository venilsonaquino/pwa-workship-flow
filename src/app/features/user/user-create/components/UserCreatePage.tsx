import React from 'react';
import { Button } from '@shared/components/ui/button';

const UserCreatePage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-background">
    <h2 className="text-2xl text-primary font-medium">Criar Usuário</h2>
    <p className="text-gray-500">Formulário de criação de usuário</p>
    <Button variant="ghost" onClick={() => history.back()}>
      ← Voltar
    </Button>
  </div>
);

export default UserCreatePage;
