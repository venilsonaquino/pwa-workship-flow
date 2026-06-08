import { useState, useCallback } from 'react';
import type { UpdateUserDto, User } from '../types';
import { userService } from '../services/userService';

/**
 * useUpdateUser
 * Manages states (loading, error) and api calls to update a user.
 */
export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (id: string, data: UpdateUserDto): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.update(id, data);
      setIsLoading(false);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(message);
      setIsLoading(false);
      return null;
    }
  }, []);

  return { updateUser, isLoading, error };
}

export default useUpdateUser;
