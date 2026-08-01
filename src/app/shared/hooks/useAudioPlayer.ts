import { useCallback, useSyncExternalStore } from 'react';
import { getAbsoluteMediaUrl } from '@src/lib/utils';

// ── Singleton State ────────────────────────────────────────────────────────────

let _audioInstance: HTMLAudioElement | null = null;
let _currentSongId: string | null = null;
let _isPlaying = false;
let _currentTime = 0;
let _duration = 0;
let _progressPct = 0;
let _stateVersion = 0;

const _subscribers = new Set<() => void>();

function notifySubscribers(): void {
  _subscribers.forEach((callback) => callback());
}

function subscribe(callback: () => void): () => void {
  _subscribers.add(callback);
  return () => _subscribers.delete(callback);
}

function getStateVersion(): number {
  return _stateVersion;
}

function setPlayerState(patch: {
  currentSongId?: string | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  progressPct?: number;
}): void {
  if (patch.currentSongId !== undefined) _currentSongId = patch.currentSongId;
  if (patch.isPlaying !== undefined) _isPlaying = patch.isPlaying;
  if (patch.currentTime !== undefined) _currentTime = patch.currentTime;
  if (patch.duration !== undefined) _duration = patch.duration;
  if (patch.progressPct !== undefined) _progressPct = patch.progressPct;
  _stateVersion += 1;
  notifySubscribers();
}

function formatTime(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds) || !isFinite(totalSeconds)) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getAudioInstance(): HTMLAudioElement {
  if (!_audioInstance && typeof window !== 'undefined') {
    _audioInstance = new Audio();

    _audioInstance.addEventListener('timeupdate', () => {
      if (!_audioInstance) return;
      const current = _audioInstance.currentTime || 0;
      const duration =
        _audioInstance.duration && isFinite(_audioInstance.duration)
          ? _audioInstance.duration
          : _duration;
      const progressPercentage = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

      setPlayerState({
        currentTime: current,
        duration: duration,
        progressPct: progressPercentage,
      });
    });

    _audioInstance.addEventListener('play', () => {
      setPlayerState({ isPlaying: true });
    });

    _audioInstance.addEventListener('playing', () => {
      setPlayerState({ isPlaying: true });
    });

    _audioInstance.addEventListener('pause', () => {
      setPlayerState({ isPlaying: false });
    });

    _audioInstance.addEventListener('ended', () => {
      setPlayerState({
        isPlaying: false,
        currentTime: 0,
        progressPct: 0,
      });
    });

    _audioInstance.addEventListener('error', (event) => {
      console.error('[AudioPlayer] Erro na reprodução do áudio:', event);
      setPlayerState({ isPlaying: false });
    });
  }
  return _audioInstance!;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export interface AudioTarget {
  id: string;
  audioUrl: string;
  durationSeconds?: number;
}

export function useAudioPlayer() {
  // The audio player lives outside React, so subscribe to it as an external
  // store. This guarantees that play/pause changes are reflected immediately,
  // including updates that happen between render and effect execution.
  useSyncExternalStore(subscribe, getStateVersion, getStateVersion);

  const togglePlay = useCallback((targetSong: AudioTarget) => {
    const audio = getAudioInstance();
    const resolvedUrl = getAbsoluteMediaUrl(targetSong.audioUrl);

    if (_currentSongId === targetSong.id) {
      if (_isPlaying) {
        audio.pause();
        return;
      }

      setPlayerState({ isPlaying: true });
      void audio.play().catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('[AudioPlayer] Falha ao dar play:', error);
        setPlayerState({ isPlaying: false });
      });
      return;
    }

    audio.pause();
    audio.src = resolvedUrl;
    const fallbackDuration = targetSong.durationSeconds || 0;
    setPlayerState({
      currentSongId: targetSong.id,
      currentTime: 0,
      duration: fallbackDuration,
      progressPct: 0,
      isPlaying: true,
    });

    void audio.play().catch((error: unknown) => {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('[AudioPlayer] Falha ao dar play na nova faixa:', error);
      setPlayerState({ isPlaying: false });
    });
  }, []);

  const seekPct = useCallback((percentage: number) => {
    const audio = getAudioInstance();
    if (!audio || !_duration) return;
    const targetTime = (percentage / 100) * _duration;
    audio.currentTime = targetTime;
    setPlayerState({
      currentTime: targetTime,
      progressPct: percentage,
    });
  }, []);

  const pause = useCallback(() => {
    if (_audioInstance) {
      _audioInstance.pause();
    }
  }, []);

  return {
    currentSongId: _currentSongId,
    isPlaying: _isPlaying,
    currentTime: _currentTime,
    duration: _duration,
    currentTimeFormatted: formatTime(_currentTime),
    durationFormatted: formatTime(_duration),
    progressPct: _progressPct,
    togglePlay,
    seekPct,
    pause,
  };
}
