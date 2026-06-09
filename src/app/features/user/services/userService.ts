import type { User, UserFilters, UserListResponse, CreateUserDto, UpdateUserDto } from '../types';

// ── Mock data state (stored in module memory for dynamic fallback updates) ─────
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Beatriz Costa',
    email: 'ana.costa@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=ana',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T08:30:00Z',
  },
  {
    id: '2',
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=carlos',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-05-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Fernanda Oliveira',
    email: 'fernanda.o@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=fernanda',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '4',
    name: 'Rafael Mendonça',
    email: 'rafael.m@email.com',
    role: 'editor',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=rafael',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-04-01T12:00:00Z',
  },
  {
    id: '5',
    name: 'Juliana Pereira',
    email: 'juliana.p@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=juliana',
    createdAt: '2024-04-05T11:00:00Z',
    updatedAt: '2024-06-05T09:00:00Z',
  },
  {
    id: '6',
    name: 'Lucas Rodrigues',
    email: 'lucas.r@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=lucas',
    createdAt: '2024-04-10T09:15:00Z',
    updatedAt: '2024-06-02T11:20:00Z',
  },
  {
    id: '7',
    name: 'Mariana Silva',
    email: 'mariana.silva@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=mariana',
    createdAt: '2024-04-12T14:30:00Z',
    updatedAt: '2024-04-12T14:30:00Z',
  },
  {
    id: '8',
    name: 'Bruno Santos',
    email: 'bruno.santos@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=bruno',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-06-04T16:45:00Z',
  },
  {
    id: '9',
    name: 'Camila Souza',
    email: 'camila.souza@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=camila',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-05-15T09:10:00Z',
  },
  {
    id: '10',
    name: 'Diego Rocha',
    email: 'diego.rocha@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=diego',
    createdAt: '2024-02-15T11:20:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
  },
  {
    id: '11',
    name: 'Amanda Melo',
    email: 'amanda.melo@email.com',
    role: 'viewer',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=amanda',
    createdAt: '2023-12-10T09:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '12',
    name: 'Felipe Cardoso',
    email: 'felipe.c@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=felipe',
    createdAt: '2024-03-22T13:40:00Z',
    updatedAt: '2024-06-07T11:15:00Z',
  },
  {
    id: '13',
    name: 'Larissa Martins',
    email: 'larissa.m@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=larissa',
    createdAt: '2024-05-01T15:20:00Z',
    updatedAt: '2024-05-01T15:20:00Z',
  },
  {
    id: '14',
    name: 'Gabriel Alves',
    email: 'gabriel.alves@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=gabriel',
    createdAt: '2024-02-28T08:30:00Z',
    updatedAt: '2024-06-02T17:40:00Z',
  },
  {
    id: '15',
    name: 'Beatriz Gomes',
    email: 'beatriz.g@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=beatriz',
    createdAt: '2024-03-05T10:50:00Z',
    updatedAt: '2024-06-05T09:30:00Z',
  },
  {
    id: '16',
    name: 'Gustavo Lima',
    email: 'gustavo.lima@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=gustavo',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-06-08T10:00:00Z',
  },
  {
    id: '17',
    name: 'Leticia Ribeiro',
    email: 'leticia.r@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=leticia',
    createdAt: '2024-04-18T11:00:00Z',
    updatedAt: '2024-06-03T13:10:00Z',
  },
  {
    id: '18',
    name: 'Thiago Ramos',
    email: 'thiago.ramos@email.com',
    role: 'editor',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=thiago',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-05-10T16:00:00Z',
  },
  {
    id: '19',
    name: 'Isabella Carvalho',
    email: 'isabella.c@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=isabella',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
  },
  {
    id: '20',
    name: 'Matheus Costa',
    email: 'matheus.costa@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=matheus',
    createdAt: '2024-03-30T11:15:00Z',
    updatedAt: '2024-06-06T15:20:00Z',
  },
  {
    id: '21',
    name: 'Patricia Araujo',
    email: 'patricia.a@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=patricia',
    createdAt: '2024-02-10T08:45:00Z',
    updatedAt: '2024-05-28T14:30:00Z',
  },
  {
    id: '22',
    name: 'Rodrigo Correia',
    email: 'rodrigo.c@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=rodrigo',
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-06-08T11:45:00Z',
  },
  {
    id: '23',
    name: 'Aline Ferreira',
    email: 'aline.f@email.com',
    role: 'viewer',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=aline',
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2024-02-20T11:00:00Z',
  },
  {
    id: '24',
    name: 'Daniel Barbosa',
    email: 'daniel.b@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=daniel',
    createdAt: '2024-04-02T13:00:00Z',
    updatedAt: '2024-06-07T16:20:00Z',
  },
  {
    id: '25',
    name: 'Gabriela Castro',
    email: 'gabriela.c@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=gabriela',
    createdAt: '2024-05-15T09:00:00Z',
    updatedAt: '2024-05-15T09:00:00Z',
  },
  {
    id: '26',
    name: 'Leonardo Dias',
    email: 'leonardo.dias@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=leonardo',
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-06-01T10:15:00Z',
  },
  {
    id: '27',
    name: 'Vanessa Moreira',
    email: 'vanessa.m@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=vanessa',
    createdAt: '2024-02-05T09:10:00Z',
    updatedAt: '2024-06-04T12:30:00Z',
  },
  {
    id: '28',
    name: 'Marcelo Vieira',
    email: 'marcelo.v@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=marcelo',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-06-08T15:00:00Z',
  },
  {
    id: '29',
    name: 'Tatiana Nunes',
    email: 'tatiana.nunes@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=tatiana',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-05-20T08:50:00Z',
  },
  {
    id: '30',
    name: 'Vinicius Teixeira',
    email: 'vinicius.t@email.com',
    role: 'editor',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=vinicius',
    createdAt: '2024-02-12T14:00:00Z',
    updatedAt: '2024-04-12T16:30:00Z',
  },
  {
    id: '31',
    name: 'Clarissa Farias',
    email: 'clarissa.f@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=clarissa',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2024-05-20T11:00:00Z',
  },
  {
    id: '32',
    name: 'Henrique Neves',
    email: 'henrique.n@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=henrique',
    createdAt: '2024-03-08T09:15:00Z',
    updatedAt: '2024-06-06T10:30:00Z',
  },
  {
    id: '33',
    name: 'Priscila Mendes',
    email: 'priscila.m@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=priscila',
    createdAt: '2024-04-05T08:30:00Z',
    updatedAt: '2024-05-30T14:15:00Z',
  },
  {
    id: '34',
    name: 'Eduardo Cunha',
    email: 'eduardo.c@email.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=eduardo',
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-06-09T09:00:00Z',
  },
  {
    id: '35',
    name: 'Sabrina Rocha',
    email: 'sabrina.r@email.com',
    role: 'viewer',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=sabrina',
    createdAt: '2023-12-15T09:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
  },
  {
    id: '36',
    name: 'Renato Assunção',
    email: 'renato.a@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=renato',
    createdAt: '2024-04-15T15:00:00Z',
    updatedAt: '2024-06-05T11:20:00Z',
  },
  {
    id: '37',
    name: 'Bianca Antunes',
    email: 'bianca.a@email.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=bianca',
    createdAt: '2024-05-25T10:00:00Z',
    updatedAt: '2024-05-25T10:00:00Z',
  },
  {
    id: '38',
    name: 'Samuel Rezende',
    email: 'samuel.r@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=samuel',
    createdAt: '2024-02-25T13:00:00Z',
    updatedAt: '2024-06-03T16:45:00Z',
  },
  {
    id: '39',
    name: 'Carolina Peixoto',
    email: 'carolina.p@email.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=carolina',
    createdAt: '2024-03-12T09:30:00Z',
    updatedAt: '2024-06-07T14:10:00Z',
  },
  {
    id: '40',
    name: 'Murilo Fogaça',
    email: 'murilo.f@email.com',
    role: 'viewer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=murilo',
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-06-08T09:30:00Z',
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
