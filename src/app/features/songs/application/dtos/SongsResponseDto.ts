import type { Song, SongCategory, SongStatus, SongListen } from '../../domain/entities/Song';

// ── API Response DTOs ──────────────────────────────────────────────────────────
// Shape exata retornada pelo endpoint GET /api/songs

export interface SongListenApiDto {
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  listenedAt: string;
}

export interface SongApiDto {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  album: string | null;
  thumbnailUrl: string;
  durationSeconds: number;
  audioUrl: string;
  cifra: string[] | null;
  cifraClubUrl: string | null;
  letrasUrl: string | null;
  suggestedByName: string;
  createdAt: string;
  bandEngagementPercentage: number;
  hasListened: boolean;
  status: SongStatus;
  listens?: SongListenApiDto[];
}

export interface SongsApiResponse {
  success: boolean;
  data: {
    suggestions: SongApiDto[];
    evaluating: SongApiDto[];
    repertoire: SongApiDto[];
  };
  error: string | null;
}

// ── Mapper ────────────────────────────────────────────────────────────────────
// Converte SongApiDto → Song (entidade de domínio), injetando a categoria

export function mapSongListenDtoToEntity(dto: SongListenApiDto): SongListen {
  return {
    userId: dto.userId,
    userName: dto.userName,
    userAvatarUrl: dto.userAvatarUrl,
    listenedAt: dto.listenedAt,
  };
}

export function mapSongDtoToEntity(dto: SongApiDto, category: SongCategory): Song {
  return {
    id: dto.id,
    videoId: dto.videoId,
    title: dto.title,
    artist: dto.artist,
    album: dto.album,
    thumbnailUrl: dto.thumbnailUrl,
    durationSeconds: dto.durationSeconds,
    audioUrl: dto.audioUrl,
    cifra: dto.cifra,
    cifraClubUrl: dto.cifraClubUrl,
    letrasUrl: dto.letrasUrl,
    suggestedByName: dto.suggestedByName,
    createdAt: dto.createdAt,
    bandEngagementPercentage: dto.bandEngagementPercentage,
    hasListened: dto.hasListened,
    status: dto.status,
    category,
    listens: (dto.listens || []).map(mapSongListenDtoToEntity),
  };
}
