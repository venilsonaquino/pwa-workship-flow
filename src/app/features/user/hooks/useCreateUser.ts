import { useState, useCallback } from 'react';
import type { CreateUserDto, User } from '../types';
import { userService } from '../services/userService';

/**
 * useCreateUser
 * Manages states (loading, error) and api calls to create a new user.
 */
export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: CreateUserDto): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.create(data);
      setIsLoading(false);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(message);
      setIsLoading(false);
      return null;
    }
  }, []);

  return { createUser, isLoading, error };
}

export default useCreateUser;
