// ── Song Search Result Entity ──────────────────────────────────────────────────
// Resultado retornado por GET /api/songs/search?query=
// É uma entidade mais simples que Song — ainda não foi processada/processada pelo backend

export interface SongSearchResult {
  readonly videoId: string;
  readonly title: string;
  readonly artist: string;
  readonly album: string;
  readonly thumbnailUrl: string;
  readonly durationSeconds: number;
}

// ── Suggest Payload ────────────────────────────────────────────────────────────
// Body enviado para POST /api/songs/suggest

export interface SuggestSongPayload {
  readonly videoId: string;
  readonly title: string;
  readonly artist: string;
  readonly album: string;
  readonly thumbnailUrl: string;
  readonly durationSeconds: number;
}
