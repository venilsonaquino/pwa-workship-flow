import { cn } from '@src/lib/utils';
import Button from '@shared/components/ui/button';
import { MarqueeText, useCelebration } from '@shared/components/effects';
import type { Song } from '../types';

export interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onHeardToggle: () => void;
  showCategoryBadge?: boolean;
}

export const SongCard = ({
  song,
  isPlaying,
  onPlayToggle,
  onHeardToggle,
  showCategoryBadge = false,
}: SongCardProps) => {
  const { trigger: triggerCelebration, renderParticles } = useCelebration();

  const handleHeardClick = () => {
    if (!song.isHeard) {
      triggerCelebration();
    }
    onHeardToggle();
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sugestao':
        return 'Sugestões';
      case 'ensaiando':
        return 'Ensaiando';
      case 'repertorio':
        return 'Repertórios';
      default:
        return category;
    }
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'sugestao':
        return 'bg-primary/10 text-primary';
      case 'ensaiando':
        return 'bg-secondary/10 text-secondary';
      case 'repertorio':
        return 'bg-emerald-500/10 text-emerald-600';
      default:
        return 'bg-surface-variant text-on-surface-variant';
    }
  };

  return (
    <div
      className="bg-surface-container-lowest text-on-surface rounded-[32px] border border-outline-variant/30 custom-shadow flex flex-col gap-4 relative overflow-visible p-5"
    >
      {/* Celebration Particles */}
      {renderParticles('50%', '85%')}
      <div className="flex gap-4">
        <img
          alt="Thumbnail"
          className="w-20 h-20 rounded-lg object-cover shadow-sm"
          src={song.image}
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
          onClick={onPlayToggle}
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

      {/* Player Progress */}
      <div className="space-y-1">
        <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full vivid-gradient"
            style={{
              width: `${song.progressPct}%`
            }}
          />
        </div>
        <div
          className="flex justify-between text-[10px] text-outline font-semibold mt-[2px]"
        >
          <span>{song.progress}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Band Engagement */}
      <div
        className="border-t border-outline-variant/30 pt-2 mt-1"
      >
        <div
          className="flex items-center justify-between mb-1.5"
        >
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Engajamento da banda
          </span>
          <span className="text-label-sm font-bold text-primary">
            {song.engagement}%
          </span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)]"
            style={{ width: `${song.engagement}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-1.5">
        <button
          onClick={handleHeardClick}
          className={cn(
            "text-label-sm font-semibold transition-all duration-200 flex items-center gap-1.5 select-none cursor-pointer hover:opacity-85 active:scale-95",
            song.isHeard ? "text-success font-bold" : "text-on-surface-variant/70"
          )}
        >
          <span className={cn("material-symbols-outlined text-[20px]", song.isHeard && "icon-fill")}>
            {song.isHeard ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          {song.isHeard ? 'Ouvida' : 'Marcar como ouvida'}
        </button>

        {song.suggestedBy && (
          <span className="text-[11px] font-medium text-on-surface-variant/70">
            Sugerida por <span className="text-on-surface font-semibold">{song.suggestedBy}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default SongCard;
