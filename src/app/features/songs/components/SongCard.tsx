import { cn } from '@src/lib/utils';
import Button from '@shared/components/ui/button';
import { MarqueeText, useCelebration } from '@shared/components/effects';
import type { Song } from '../domain/entities/Song';
import { formatDuration } from '../domain/entities/Song';

export interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isCurrentSong?: boolean;
  onPlayToggle: () => void;
  onHeardToggle: () => void;
  onClick?: () => void;
  showCategoryBadge?: boolean;
  progressPct?: number;
  currentTimeFormatted?: string;
  onSeekPct?: (pct: number) => void;
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'sugestao': return 'Sugestões';
    case 'ensaiando': return 'Ensaiando';
    case 'repertorio': return 'Repertório';
    default: return category;
  }
}

function getCategoryColorClass(category: string): string {
  switch (category) {
    case 'sugestao': return 'bg-primary/10 text-primary';
    case 'ensaiando': return 'bg-secondary/10 text-secondary';
    case 'repertorio': return 'bg-emerald-500/10 text-emerald-600';
    default: return 'bg-surface-variant text-on-surface-variant';
  }
}

export const SongCard = ({
  song,
  isPlaying,
  isCurrentSong = false,
  onPlayToggle,
  onHeardToggle,
  onClick,
  showCategoryBadge = false,
  progressPct = 0,
  currentTimeFormatted = '0:00',
  onSeekPct,
}: SongCardProps) => {
  const { trigger: triggerCelebration, renderParticles } = useCelebration();

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

  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest text-on-surface rounded-[32px] border border-outline-variant/30 custom-shadow flex flex-col gap-4 relative overflow-visible p-5 cursor-pointer hover:bg-surface-container-low/20 transition-all duration-200 active:scale-[0.995]"
    >
      {/* Celebration Particles */}
      {renderParticles('50%', '85%')}
      <div className="flex gap-4">
        <img
          alt={song.title}
          className="w-20 h-20 rounded-lg object-cover shadow-sm"
          src={song.thumbnailUrl}
        />
        <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <MarqueeText
              text={song.title}
              className="font-headline-md text-on-surface leading-tight text-left flex-1 min-w-0"
            />
            {showCategoryBadge && (
              <span
                className={cn("text-[9px] font-bold uppercase tracking-wider rounded-md shrink-0 px-1.5 py-0.5", getCategoryColorClass(song.category))}
              >
                {getCategoryLabel(song.category)}
              </span>
            )}
          </div>
          <MarqueeText
            text={song.artist}
            className="text-on-surface-variant text-body-md text-left"
          />
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onPlayToggle();
          }}
          variant={isPlaying ? 'primary' : 'secondary'}
          size="md"
          iconOnly
          className="shadow-lg active:scale-90"
        >
          <span className="material-symbols-outlined icon-fill">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </Button>
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
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Engajamento da banda
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

      <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-1.5">
        <button
          onClick={handleHeardClick}
          className={cn(
            "text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 select-none cursor-pointer hover:opacity-85 active:scale-95",
            song.hasListened ? "text-success font-bold" : "text-on-surface-variant/70"
          )}
        >
          <span className={cn("material-symbols-outlined text-[20px]", song.hasListened && "icon-fill")}>
            {song.hasListened ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          {song.hasListened ? 'Ouvida' : 'Marcar como ouvida'}
        </button>
        <span className="text-[11px] font-medium text-on-surface-variant/70">
          Sugerida por <span className="text-on-surface font-semibold">{song.suggestedByName}</span>
        </span>
      </div>
    </div>
  );
};

export default SongCard;
