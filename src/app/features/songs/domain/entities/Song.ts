// ── Song Entity ────────────────────────────────────────────────────────────────
// Domínio puro — sem dependências externas

export type SongCategory = 'sugestao' | 'ensaiando' | 'repertorio';

export type SongStatus = 'ready' | 'processing' | 'pending' | 'error';

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
  readonly suggestedById?: string;
  readonly createdAt: string;
  readonly bandEngagementPercentage: number;
  readonly hasListened: boolean;
  readonly status: SongStatus;
  readonly category: SongCategory;
  readonly tom?: string | null;
  readonly listens: SongListen[];
}

// ── Value Objects & Helper Functions ──────────────────────────────────────────

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getNextCategory(current: SongCategory): SongCategory | null {
  if (current === 'sugestao') return 'ensaiando';
  if (current === 'ensaiando') return 'repertorio';
  return null;
}

export function getCategoryLabel(category: SongCategory): string {
  switch (category) {
    case 'sugestao': return 'Sugestões';
    case 'ensaiando': return 'Ensaiando';
    case 'repertorio': return 'Repertório';
    default: return category;
  }
}

export function getCategoryIcon(category: SongCategory): string {
  switch (category) {
    case 'sugestao': return 'lightbulb';
    case 'ensaiando': return 'headphones';
    case 'repertorio': return 'library_music';
    default: return 'folder';
  }
}

export function getCategoryColorClass(category: SongCategory): string {
  switch (category) {
    case 'sugestao': return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    case 'ensaiando': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
    case 'repertorio': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
    default: return 'bg-surface-variant text-on-surface-variant';
  }
}

