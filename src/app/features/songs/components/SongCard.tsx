import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@src/lib/utils';
import { useAuth, Permission } from '@shared/hooks/useAuth';
import { MarqueeText, useCelebration } from '@shared/components/effects';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shared/components/ui/dropdown-menu';
import type { Song, SongCategory } from '../domain/entities/Song';
import {
  formatDuration,
  getCategoryLabel,
} from '../domain/entities/Song';

export interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isCurrentSong?: boolean;
  onPlayToggle: () => void;
  onHeardToggle: () => void;
  onCategoryChange?: (songId: string, newCategory: SongCategory) => void;
  onDelete?: () => Promise<void> | void;
  onClick?: () => void;
  showCategoryBadge?: boolean;
  progressPct?: number;
  currentTimeFormatted?: string;
  onSeekPct?: (pct: number) => void;
}

export const SongCard = ({
  song,
  isPlaying,
  isCurrentSong = false,
  onPlayToggle,
  onHeardToggle,
  onCategoryChange,
  onDelete,
  onClick,
  progressPct = 0,
  currentTimeFormatted = '0:00',
  onSeekPct,
}: SongCardProps) => {
  const { hasPermission, userName, userId } = useAuth();
  const showEngagement = hasPermission(Permission.SongViewEngagement);
  const canEditColumns = hasPermission(Permission.SongEditColumns);
  const showCategoryOptions = Boolean(onCategoryChange && canEditColumns);
  const isSuggester = (Boolean(userId) && Boolean(song.suggestedById) && userId === song.suggestedById) || (Boolean(userName) && userName?.trim().toLowerCase() === song.suggestedByName?.trim().toLowerCase());
  const { trigger: triggerCelebration, renderParticles } = useCelebration();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNoAudioToast, setShowNoAudioToast] = useState(false);

  const isProcessing = song.status === 'pending' || song.status === 'processing';
  const hasAudioError = song.status === 'error';

  useEffect(() => {
    if (!showNoAudioToast) return;
    const timer = setTimeout(() => setShowNoAudioToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showNoAudioToast]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    if (hasAudioError) {
      setShowNoAudioToast(true);
      return;
    }
    onPlayToggle();
  };

  const handleHeardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song.hasListened) {
      triggerCelebration();
    }
    onHeardToggle();
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!onSeekPct || !isCurrentSong) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    onSeekPct(pct);
  };

  const handleSelectCategory = (category: SongCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCategoryChange) {
      onCategoryChange(song.id, category);
    }
  };

  const handleDeleteConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id={`song-card-${song.id}`}
      onClick={onClick}
      className="bg-surface-container-lowest text-on-surface rounded-[32px] border border-outline-variant/30 custom-shadow flex flex-col gap-4 relative overflow-visible p-5 cursor-pointer hover:bg-surface-container-low/20 transition-all duration-200 active:scale-[0.995]"
    >
      {/* Celebration Particles */}
      {renderParticles('50%', '85%')}

      {/* Main Card Header */}
      <div className="flex items-center gap-4">
        {/* Vinyl Disc Player */}
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={isProcessing}
          className={cn(
            "relative shrink-0 w-20 h-20 group text-left",
            hasAudioError || isProcessing ? "cursor-not-allowed" : "cursor-pointer"
          )}
          title={isProcessing ? 'Áudio em preparação' : hasAudioError ? 'Áudio indisponível' : isPlaying ? 'Pausar' : 'Tocar'}
          aria-label={isProcessing ? 'Áudio em preparação' : hasAudioError ? 'Áudio indisponível' : isPlaying ? 'Pausar' : 'Tocar'}
        >
          {/* Vinyl Disc Body */}
          <div
            className={cn(
              "vinyl-disc w-20 h-20 rounded-full p-1 border-2 shadow-lg relative flex items-center justify-center overflow-hidden transition-all duration-300",
              hasAudioError || isProcessing
                ? "bg-neutral-900 border-neutral-700/50 opacity-50 grayscale"
                : "bg-neutral-950 border-neutral-800/80 group-hover:scale-105 group-hover:border-primary/50"
            )}
            data-playing={!hasAudioError && !isProcessing && isPlaying}
            style={{
              backgroundImage: `radial-gradient(circle at center, transparent 35%, rgba(255,255,255,0.06) 36%, transparent 40%, rgba(255,255,255,0.04) 45%, transparent 60%)`,
            }}
          >
            {/* Inner Album Cover */}
            <img
              alt={song.title}
              className="w-11 h-11 rounded-full object-cover pointer-events-none shadow-inner"
              src={song.thumbnailUrl}
            />

            {/* Vinyl Spindle Center Hole */}
            <div className="absolute inset-auto w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-700 pointer-events-none z-10" />

            {/* Subtle Hover Overlay (only when audio available) */}
            {!hasAudioError && !isProcessing && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-15" />
            )}

            {/* Error overlay — show music_off icon */}
            {hasAudioError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 text-[22px] select-none">music_off</span>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 z-20 pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 text-[22px] animate-spin select-none">progress_activity</span>
              </div>
            )}
          </div>

          {/* Floating Play/Pause Action Badge — only when audio is available */}
          {!hasAudioError && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1 z-30 w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-surface-container-lowest transition-all duration-200",
                isProcessing
                  ? "bg-surface-container-high text-outline shadow-black/20"
                  : "bg-primary text-on-primary group-hover:scale-110 active:scale-95",
                !isProcessing && (isPlaying ? "shadow-primary/40 ring-2 ring-primary/30 animate-pulse" : "shadow-black/40")
              )}
            >
              <span className={cn("material-symbols-outlined icon-fill text-[16px] leading-none select-none", !isPlaying && "ml-0.5")}>
                {isProcessing ? 'play_arrow' : isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </div>
          )}
        </button>

        {/* Song Info (Title & Artist) */}
        <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden">
          <MarqueeText
            text={song.title}
            className="font-headline-md text-on-surface leading-tight text-left mb-1"
          />
          <MarqueeText
            text={song.artist}
            className="text-on-surface-variant text-body-md text-left"
          />
        </div>

        {/* Header Right Actions (Status & 3-Dots Menu) */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Action Menu (Move / Delete) */}
          {(showCategoryOptions || (onDelete && isSuggester)) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none shrink-0">
                <span className="material-symbols-outlined text-[20px] leading-none select-none">more_vert</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl p-1.5 w-52 z-50">
                {showCategoryOptions && (
                  <>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">
                      Mover para coluna...
                    </div>
                    {(['sugestao', 'ensaiando', 'repertorio'] as SongCategory[]).map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        active={song.category === cat}
                        onClick={(e) => handleSelectCategory(cat, e)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-label-md rounded-xl transition-colors cursor-pointer',
                          song.category === cat ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{getCategoryLabel(cat)}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}

                {onDelete && isSuggester && (
                  <>
                    {showCategoryOptions && <div className="my-1 border-t border-outline-variant/20" />}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-label-md rounded-xl text-error hover:bg-error/10 transition-colors cursor-pointer font-semibold"
                    >
                      <span>Excluir música</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/10">
          <div
            className="flex items-center gap-2.5 px-3 py-2 text-amber-500"
            role="status"
            aria-live="polite"
          >
            <span className="material-symbols-outlined text-[18px] leading-none animate-spin select-none">
              progress_activity
            </span>
            <span className="text-[12px] font-semibold">Preparando áudio e cifra...</span>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${song.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="processing-youtube-link flex w-full items-center justify-center gap-2 border-t border-amber-500/15 px-3 py-2 text-[11px] font-medium text-on-surface-variant/70 transition-colors hover:bg-amber-500/5 hover:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-outline/40"
            aria-label={`Ouvir ${song.title} no YouTube enquanto o áudio é preparado`}
          >
            <span className="flex h-3.5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-error text-white shadow-sm select-none">
              <span className="ml-px h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white" />
            </span>
            <span>Ouvir no YouTube enquanto isso</span>
          </a>
        </div>
      )}

      {/* Audio Progress Bar */}
      <div className={cn("space-y-1", isProcessing && "opacity-45")} onClick={handleProgressBarClick}>
        <div className={cn("w-full bg-surface-variant h-1.5 rounded-full overflow-hidden relative", isProcessing ? "cursor-not-allowed" : "cursor-pointer")}>
          <div
            className="h-full rounded-full vivid-gradient transition-all duration-100"
            style={{ width: `${isCurrentSong ? progressPct : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-outline font-semibold mt-[2px]">
          <span>{isCurrentSong ? currentTimeFormatted : '0:00'}</span>
          <span>{formatDuration(song.durationSeconds)}</span>
        </div>
      </div>

      {/* Band Engagement */}
      {showEngagement && (
        <div className="border-t border-outline-variant/30 pt-2 mt-1 px-2 -mx-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-label-sm text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] leading-none shrink-0 select-none">groups</span>
              <span>Engajamento da banda</span>
            </span>
            <span className="text-label-sm font-bold text-primary">
              {song.bandEngagementPercentage}%
            </span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)]"
              style={{ width: `${song.bandEngagementPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Footer Action */}
      <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-1.5">
        <button
          type="button"
          onClick={handleHeardClick}
          className={cn(
            "text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 select-none cursor-pointer hover:opacity-85 active:scale-95",
            song.hasListened ? "text-success font-bold" : "text-on-surface-variant/70"
          )}
        >
          <span className={cn("material-symbols-outlined text-[18px] leading-none shrink-0 select-none", song.hasListened && "icon-fill")}>
            {song.hasListened ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>{song.hasListened ? 'Ouvida' : 'Marcar como ouvida'}</span>
        </button>
        <span className="text-[11px] font-medium text-on-surface-variant/70">
          Sugerida por <span className="text-on-surface font-semibold">{song.suggestedByName}</span>
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && onDelete && isSuggester && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            if (isDeleting) return;
            setShowDeleteConfirm(false);
          }}
          role="presentation"
        >
          <div
            className="bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-song-title-${song.id}`}
          >
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <h3 id={`delete-song-title-${song.id}`} className="text-title-md font-bold">Excluir música?</h3>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Tem certeza que deseja remover <strong>"{song.title}"</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDeleting) return;
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-label-lg font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="min-w-[88px] px-4 py-2 rounded-xl bg-error text-on-error text-label-lg font-bold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
              >
                {isDeleting ? (
                  <span className="material-symbols-outlined text-[20px] leading-none animate-spin">progress_activity</span>
                ) : 'Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* No Audio Toast */}
      {showNoAudioToast && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/40 text-on-surface text-[12px] font-semibold px-4 py-2.5 rounded-2xl shadow-xl whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px] leading-none text-on-surface-variant select-none">music_off</span>
            <span>Áudio indisponível para esta música</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongCard;
