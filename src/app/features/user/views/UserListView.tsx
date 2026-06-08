import React, { useEffect, useState } from 'react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useThemeStore } from '@shared/hooks/useThemeStore';
import { UserTableRow } from '../components/UserTableRow';
import { useUsersList } from '../hooks/useUsersList';
import type { User } from '../types';

export const UserListView: React.FC = () => {
  const { toggleTheme, theme: themeName } = useThemeStore();
  const [search, setSearch] = useState('');

  const {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    applyFilters,
    refresh,
  } = useUsersList();

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ search });
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUserClick = (user: User) => {
    console.info('[UserList] Navigating to user:', user.id);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-[200] bg-surface border-b border-border p-4 backdrop-blur-md -webkit-backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Usuários
            </h1>
            {!isLoading && (
              <span className="text-sm text-placeholder bg-surface-variant px-2.5 py-1 rounded-full">
                {total}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              title={`Mudar para tema ${themeName === 'dark' ? 'claro' : 'escuro'}`}
              className="w-10 h-10 rounded-full bg-surface-variant border border-border flex items-center justify-center text-lg transition-all duration-150 ease-in-out cursor-pointer hover:rotate-[20deg] hover:scale-110 hover:border-primary"
            >
              {themeName === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Novo Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => console.info('[UserList] Add user')}
              leftIcon={<span>＋</span>}
            >
              Novo
            </Button>
          </div>
        </div>

        {/* Search input */}
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar usuários"
          leftAdornment={<span className="text-base">🔍</span>}
          rightAdornment={
            search ? (
              <button
                onClick={() => setSearch('')}
                className="text-sm text-placeholder hover:text-on-surface"
                aria-label="Limpar busca"
              >
                ✕
              </button>
            ) : null
          }
        />
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {/* Loading state */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gradient-to-r from-surface-variant via-surface to-surface-variant bg-[length:200%_100%] animate-shimmer"
            />
          ))}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center flex-1">
            <span className="text-[48px]">⚠️</span>
            <p className="text-base text-placeholder">{error}</p>
            <Button variant="secondary" onClick={refresh}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* User list */}
        {!isLoading && !error && users.length > 0 &&
          users.map((user, index) => (
            <div
              key={user.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <UserTableRow user={user} onClick={handleUserClick} />
            </div>
          ))}

        {/* Empty state */}
        {!isLoading && !error && users.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center flex-1">
            <span className="text-[48px]">👥</span>
            <p className="text-placeholder text-base">
              {search ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
            </p>
            <Button variant="primary" onClick={() => console.info('[UserList] Create first user')}>
              Criar primeiro usuário
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserListView;
