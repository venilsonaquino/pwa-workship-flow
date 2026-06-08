import { useState, useCallback } from 'react';
import { userService } from '../services/userService';

/**
 * useDeleteUser
 * Manages states (loading, error) and api calls to delete a user.
 */
export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.delete(id);
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      setError(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  return { deleteUser, isLoading, error };
}

export default useDeleteUser;
