import type { ISongRepository, SongsResult } from '../../domain/repositories/ISongRepository';
import { mapSongDtoToEntity } from '../../application/dtos/SongsResponseDto';
import type { SongsApiResponse } from '../../application/dtos/SongsResponseDto';
import type { SongSearchResult, SuggestSongPayload } from '../../domain/entities/SongSearch';

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

interface SearchApiResponse {
  success: boolean;
  data: SongSearchResult[];
  error: string | null;
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

  async search(token: string, query: string): Promise<SongSearchResult[]> {
    const url = `${BASE_URL}/songs/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar músicas (HTTP ${response.status})`);
    }

    const body = (await response.json()) as SearchApiResponse;
    return body.data;
  }

  async suggest(token: string, payload: SuggestSongPayload): Promise<void> {
    const response = await fetch(`${BASE_URL}/songs/suggest`, {
      method: 'POST',
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao sugerir música (HTTP ${response.status})`);
    }
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────────
export const httpSongRepository = new HttpSongRepository();
