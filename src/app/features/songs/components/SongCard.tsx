import React, { useState } from 'react';
import { cn } from '@src/lib/utils';
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
  onDelete?: () => void;
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
  showCategoryBadge: _showCategoryBadge = false,
  progressPct = 0,
  currentTimeFormatted = '0:00',
  onSeekPct,
}: SongCardProps) => {
  const { trigger: triggerCelebration, renderParticles } = useCelebration();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete();
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
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlayToggle();
          }}
          className="relative shrink-0 w-20 h-20 group cursor-pointer"
          title={isPlaying ? 'Pausar' : 'Tocar'}
        >
          {/* Vinyl Disc Body */}
          <div
            className={cn(
              "w-20 h-20 rounded-full p-1 bg-neutral-950 border-2 border-neutral-800/80 shadow-lg relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105",
              isPlaying && "animate-[spin_4s_linear_infinite]"
            )}
            style={{
              backgroundImage: `radial-gradient(circle at center, transparent 35%, rgba(255,255,255,0.06) 36%, transparent 40%, rgba(255,255,255,0.04) 45%, transparent 60%)`
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
          </div>

          {/* Play/Pause Center Action Overlay */}
          <div
            className={cn(
              "absolute inset-0 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-200 opacity-0 group-hover:opacity-100 z-20",
              isPlaying && "opacity-100 bg-black/25"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95">
              <span className="material-symbols-outlined icon-fill text-[22px] leading-none select-none">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </div>
          </div>
        </div>

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
          {/* Processing Audio Badge */}
          {(song.status === 'pending' || song.status === 'processing') && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full" title="Baixando áudio em segundo plano">
              <span className="material-symbols-outlined text-[12px] leading-none animate-spin select-none">sync</span>
            </span>
          )}
          {song.status === 'error' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded-full" title="Erro no áudio">
              <span className="material-symbols-outlined text-[12px] leading-none select-none">error</span>
            </span>
          )}

          {/* Action Menu (Move / Delete) */}
          {(onCategoryChange || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none shrink-0">
                <span className="material-symbols-outlined text-[20px] leading-none select-none">more_vert</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl p-1.5 w-52 z-50">
                {onCategoryChange && (
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

                {onDelete && (
                  <>
                    {onCategoryChange && <div className="my-1 border-t border-outline-variant/20" />}
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

      {/* Audio Progress Bar */}
      <div className="space-y-1" onClick={handleProgressBarClick}>
        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden relative cursor-pointer">
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
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(false);
          }}
        >
          <div
            className="bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <h3 className="text-title-md font-bold">Excluir música?</h3>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Tem certeza que deseja remover <strong>"{song.title}"</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-label-lg font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-error text-on-error text-label-lg font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongCard;

