import type { User, UserFilters, UserListResponse, CreateUserDto, UpdateUserDto } from '../types';

// ── Mock data state (stored in module memory for dynamic fallback updates) ─────
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Beatriz Costa',
    email: 'ana.costa@email.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T08:30:00Z',
  },
  {
    id: '2',
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    role: 'editor',
    status: 'active',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-05-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Fernanda Oliveira',
    email: 'fernanda.o@email.com',
    role: 'viewer',
    status: 'pending',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '4',
    name: 'Rafael Mendonça',
    email: 'rafael.m@email.com',
    role: 'editor',
    status: 'inactive',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-04-01T12:00:00Z',
  },
  {
    id: '5',
    name: 'Juliana Pereira',
    email: 'juliana.p@email.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-04-05T11:00:00Z',
    updatedAt: '2024-06-05T09:00:00Z',
  },
];

// ── Service ────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userService = {
  /**
   * Fetch paginated users list.
   * Falls back to mock data when the API is unavailable.
   */
  async getAll(filters: UserFilters): Promise<UserListResponse> {
    const params = new URLSearchParams();
    if (filters.search)  params.set('search', filters.search);
    if (filters.role)    params.set('role', filters.role);
    if (filters.status)  params.set('status', filters.status);
    if (filters.page)    params.set('page', String(filters.page));
    if (filters.limit)   params.set('limit', String(filters.limit));

    try {
      const response = await fetch(`${BASE_URL}/users?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<UserListResponse>;
    } catch {
      // Offline fallback: return mock data
      const limit = filters.limit ?? 20;
      const page  = filters.page ?? 1;

      let filtered = [...MOCK_USERS];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
        );
      }
      if (filters.role)   filtered = filtered.filter((u) => u.role === filters.role);
      if (filters.status) filtered = filtered.filter((u) => u.status === filters.status);

      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }
  },

  /**
   * Create a new user.
   */
  async create(data: CreateUserDto): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<User>;
    } catch {
      // Offline fallback
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        avatar: data.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS.unshift(newUser);
      return newUser;
    }
  },

  /**
   * Update an existing user.
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<User>;
    } catch {
      // Offline fallback
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('Usuário não encontrado');
      const updatedUser = {
        ...MOCK_USERS[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS[index] = updatedUser;
      return updatedUser;
    }
  },

  /**
   * Delete a user.
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch {
      // Offline fallback
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('Usuário não encontrado');
      MOCK_USERS.splice(index, 1);
    }
  },
};
