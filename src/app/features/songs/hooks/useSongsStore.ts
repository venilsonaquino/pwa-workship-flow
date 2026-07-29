import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { FetchSongs } from '../application/use-cases/FetchSongs';
import { httpSongRepository } from '../infrastructure/repositories/HttpSongRepository';
import type { Song, SongCategory } from '../domain/entities/Song';

// ── Singleton state (shared across all hook instances) ────────────────────────

const fetchSongsUseCase = new FetchSongs(httpSongRepository);

let _suggestions: Song[] = [];
let _evaluating: Song[] = [];
let _repertoire: Song[] = [];
let _isLoading = false;
let _error: string | null = null;

const _subscribers = new Set<() => void>();

function notifySubscribers(): void {
  _subscribers.forEach((callback) => callback());
}

function setSharedState(patch: {
  suggestions?: Song[];
  evaluating?: Song[];
  repertoire?: Song[];
  isLoading?: boolean;
  error?: string | null;
}): void {
  if (patch.suggestions !== undefined) _suggestions = patch.suggestions;
  if (patch.evaluating !== undefined) _evaluating = patch.evaluating;
  if (patch.repertoire !== undefined) _repertoire = patch.repertoire;
  if (patch.isLoading !== undefined) _isLoading = patch.isLoading;
  if (patch.error !== undefined) _error = patch.error;
  notifySubscribers();
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useSongsStore() {
  const { token, isAuthenticated } = useAuth();
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((count) => count + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  const fetchSongs = useCallback(
    async (fetchOptions?: { silent?: boolean }) => {
      const activeToken = token || localStorage.getItem('worshipflow_token') || '';
      if (!activeToken) return;

      const isSilent = fetchOptions?.silent ?? false;

      if (!isSilent) {
        setSharedState({ isLoading: true, error: null });
      }

      try {
        const result = await fetchSongsUseCase.execute(activeToken);
        setSharedState({
          suggestions: result.suggestions,
          evaluating: result.evaluating,
          repertoire: result.repertoire,
          isLoading: false,
          error: null,
        });
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : 'Erro ao buscar músicas';
        setSharedState({ isLoading: false, error: message });
      }
    },
    [token]
  );

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchSongs({ silent: _suggestions.length > 0 });
  }, [isAuthenticated, token, fetchSongs]);

  const markAsListened = useCallback(
    async (songId: string) => {
      const activeToken = token || localStorage.getItem('worshipflow_token') || '';
      if (!activeToken) return;

      const currentSong =
        _suggestions.find((s) => s.id === songId) ||
        _evaluating.find((s) => s.id === songId) ||
        _repertoire.find((s) => s.id === songId);

      if (!currentSong) return;

      const previousStatus = currentSong.hasListened;
      const previousEngagement = currentSong.bandEngagementPercentage;
      const nextStatus = !previousStatus;
      const engagementDelta = nextStatus ? 20 : -20;
      const nextEngagement = Math.max(0, Math.min(100, previousEngagement + engagementDelta));

      // Optimistic update: toggle hasListened & update engagement percentage
      const updateListened = (list: Song[]) =>
        list.map((song) =>
          song.id === songId
            ? { ...song, hasListened: nextStatus, bandEngagementPercentage: nextEngagement }
            : song
        );

      setSharedState({
        suggestions: updateListened(_suggestions),
        evaluating: updateListened(_evaluating),
        repertoire: updateListened(_repertoire),
      });

      try {
        await httpSongRepository.markAsListened(activeToken, songId);
        // Sync exact calculation from backend
        await fetchSongs({ silent: true });
      } catch {
        // Rollback on failure
        const rollbackListened = (list: Song[]) =>
          list.map((song) =>
            song.id === songId
              ? {
                  ...song,
                  hasListened: previousStatus,
                  bandEngagementPercentage: previousEngagement,
                }
              : song
          );

        setSharedState({
          suggestions: rollbackListened(_suggestions),
          evaluating: rollbackListened(_evaluating),
          repertoire: rollbackListened(_repertoire),
        });
      }
    },
    [token, fetchSongs]
  );

  function getSongsByCategory(category: SongCategory): Song[] {
    if (category === 'sugestao') return _suggestions;
    if (category === 'ensaiando') return _evaluating;
    return _repertoire;
  }

  return {
    suggestions: _suggestions,
    evaluating: _evaluating,
    repertoire: _repertoire,
    isLoading: _isLoading,
    error: _error,
    fetchSongs,
    markAsListened,
    getSongsByCategory,
  };
}
