import React, { useEffect, useState } from 'react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Header } from '@shared/components';
import { UserTableRow } from '../components/UserTableRow';
import { useUsersList } from '../hooks/useUsersList';
import type { User } from '../types';

export const UserListView: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ search });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUserClick = (user: User) => {
    console.info('[UserList] Navigating to user:', user.id);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* ── Global Header ──────────────────────────────────────────────────── */}
      <Header 
        onSearchClick={() => console.info('[Header] Search clicked')}
        onNotificationClick={() => console.info('[Header] Notifications clicked')}
      />

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Page Title & Action Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-on-surface font-sans">
              Usuários
            </h1>
            {!isLoading && (
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full font-sans">
                {total}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => console.info('[UserList] Add user')}
            leftIcon={<span className="material-symbols-outlined text-base">add</span>}
          >
            Novo
          </Button>
        </div>

        {/* Search input - Page Specific Filter */}
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar usuários"
          leftAdornment={
            <span className="material-symbols-outlined text-on-surface-variant/70 text-lg select-none">
              search
            </span>
          }
          rightAdornment={
            search ? (
              <button
                onClick={() => setSearch('')}
                className="flex items-center justify-center p-1 rounded-full hover:bg-surface-variant text-on-surface-variant/70 hover:text-on-surface cursor-pointer"
                aria-label="Limpar busca"
              >
                <span className="material-symbols-outlined text-base select-none">
                  close
                </span>
              </button>
            ) : null
          }
        />

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
