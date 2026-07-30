import { useState, useEffect, useCallback } from 'react';
import { getAbsoluteMediaUrl } from '@src/lib/utils';

// ── Singleton State ────────────────────────────────────────────────────────────

let _audioInstance: HTMLAudioElement | null = null;
let _currentSongId: string | null = null;
let _isPlaying = false;
let _currentTime = 0;
let _duration = 0;
let _progressPct = 0;

const _subscribers = new Set<() => void>();

function notifySubscribers(): void {
  _subscribers.forEach((callback) => callback());
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
      const cur = _audioInstance.currentTime || 0;
      const dur = _audioInstance.duration && isFinite(_audioInstance.duration) ? _audioInstance.duration : _duration;
      const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;

      setPlayerState({
        currentTime: cur,
        duration: dur,
        progressPct: pct,
      });
    });

    _audioInstance.addEventListener('play', () => {
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

    _audioInstance.addEventListener('error', (e) => {
      console.error('[AudioPlayer] Erro na reprodução do áudio:', e);
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
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((c) => c + 1);
    _subscribers.add(rerender);
    return () => {
      _subscribers.delete(rerender);
    };
  }, []);

  const togglePlay = useCallback((target: AudioTarget) => {
    const audio = getAudioInstance();
    const resolvedUrl = getAbsoluteMediaUrl(target.audioUrl);

    if (_currentSongId === target.id) {
      if (_isPlaying) {
        audio.pause();
      } else {
        void audio.play().catch((err) => {
          console.error('[AudioPlayer] Falha ao dar play:', err);
        });
      }
    } else {
      audio.pause();
      audio.src = resolvedUrl;
      const fallbackDur = target.durationSeconds || 0;
      setPlayerState({
        currentSongId: target.id,
        currentTime: 0,
        duration: fallbackDur,
        progressPct: 0,
        isPlaying: false,
      });

      void audio.play().catch((err) => {
        console.error('[AudioPlayer] Falha ao dar play na nova faixa:', err);
      });
    }
  }, []);

  const seekPct = useCallback((pct: number) => {
    const audio = getAudioInstance();
    if (!audio || !_duration) return;
    const targetTime = (pct / 100) * _duration;
    audio.currentTime = targetTime;
    setPlayerState({
      currentTime: targetTime,
      progressPct: pct,
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
