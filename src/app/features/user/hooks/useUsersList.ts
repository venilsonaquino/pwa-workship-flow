import { useState, useCallback } from 'react';
import type { User, UserFilters, UserListResponse } from '../types';
import { userService } from '../services/userService';

interface UseUsersListState {
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

/**
 * useUsersList
 * Manages the user list state: fetching, pagination, filtering and refresh.
 */
export function useUsersList(initialFilters?: UserFilters) {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const [state, setState] = useState<UseUsersListState>({
    users: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    isRefreshing: false,
    error: null,
  });

  const fetchUsers = useCallback(
    async (overrideFilters?: Partial<UserFilters>, silent = false) => {
      const activeFilters = { ...filters, ...overrideFilters };

      setState((prev) => ({
        ...prev,
        isLoading: !silent,
        isRefreshing: silent,
        error: null,
      }));

      try {
        const response: UserListResponse = await userService.getAll(activeFilters);
        setState((prev) => ({
          ...prev,
          users: response.data,
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.page,
          isLoading: false,
          isRefreshing: false,
        }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar usuários';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: message,
        }));
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 };
      setFilters(updated);
      fetchUsers(updated);
    },
    [filters, fetchUsers],
  );

  const goToPage = useCallback(
    (page: number) => {
      const updated = { ...filters, page };
      setFilters(updated);
      fetchUsers(updated);
    },
    [filters, fetchUsers],
  );

  const refresh = useCallback(
    () => fetchUsers(undefined, true),
    [fetchUsers],
  );

  return {
    ...state,
    filters,
    fetchUsers,
    applyFilters,
    goToPage,
    refresh,
  };
}
export default useUsersList;
