// ── Song Entity ────────────────────────────────────────────────────────────────
// Domínio puro — sem dependências externas

export type SongCategory = 'sugestao' | 'ensaiando' | 'repertorio';

export type SongStatus = 'ready' | 'processing' | 'error';

export interface SongListen {
  readonly userId: string;
  readonly userName: string;
  readonly userAvatarUrl: string | null;
  readonly listenedAt: string;
}

export interface Song {
  readonly id: string;
  readonly videoId: string;
  readonly title: string;
  readonly artist: string;
  readonly album: string | null;
  readonly thumbnailUrl: string;
  readonly durationSeconds: number;
  readonly audioUrl: string;
  readonly cifra: string[] | null;
  readonly cifraClubUrl: string | null;
  readonly letrasUrl: string | null;
  readonly suggestedByName: string;
  readonly createdAt: string;
  readonly bandEngagementPercentage: number;
  readonly hasListened: boolean;
  readonly status: SongStatus;
  readonly category: SongCategory;
  readonly listens: SongListen[];
}

// ── Value Objects ──────────────────────────────────────────────────────────────

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
