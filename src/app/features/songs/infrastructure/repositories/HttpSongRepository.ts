import type { ISongRepository, SongsResult } from '../../domain/repositories/ISongRepository';
import { mapSongDtoToEntity } from '../../application/dtos/SongsResponseDto';
import type { SongsApiResponse } from '../../application/dtos/SongsResponseDto';

// ── HTTP Song Repository ───────────────────────────────────────────────────────
// Implementação concreta do ISongRepository via fetch.
// Isolada na camada de infraestrutura — o domínio não a conhece.

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function buildAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export class HttpSongRepository implements ISongRepository {
  async fetchAll(token: string): Promise<SongsResult> {
    const response = await fetch(`${BASE_URL}/songs`, {
      method: 'GET',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar músicas (HTTP ${response.status})`);
    }

    const body = (await response.json()) as SongsApiResponse;

    return {
      suggestions: body.data.suggestions.map((dto) => mapSongDtoToEntity(dto, 'sugestao')),
      evaluating: body.data.evaluating.map((dto) => mapSongDtoToEntity(dto, 'ensaiando')),
      repertoire: body.data.repertoire.map((dto) => mapSongDtoToEntity(dto, 'repertorio')),
    };
  }

  async markAsListened(token: string, songId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/songs/${songId}/listened`, {
      method: 'PATCH',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao marcar como ouvida (HTTP ${response.status})`);
    }
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────────
export const httpSongRepository = new HttpSongRepository();
