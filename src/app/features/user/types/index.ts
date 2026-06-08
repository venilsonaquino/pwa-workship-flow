// ── User Domain Types ─────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserListResponse = PaginatedResponse<User>;

// ── CRUD DTOs ──────────────────────────────────────────────────────────────────

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
