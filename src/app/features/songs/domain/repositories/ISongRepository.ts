import type { Song, SongCategory } from '../entities/Song';

// ── Song Repository Contract ───────────────────────────────────────────────────
// O domínio depende desta interface — nunca da implementação HTTP.

export interface SongsResult {
  readonly suggestions: Song[];
  readonly evaluating: Song[];
  readonly repertoire: Song[];
}

export interface ISongRepository {
  fetchAll(token: string): Promise<SongsResult>;
  markAsListened(token: string, songId: string): Promise<void>;
  updateCategory(token: string, songId: string, category: SongCategory): Promise<void>;
  deleteSong(token: string, songId: string): Promise<void>;
}

