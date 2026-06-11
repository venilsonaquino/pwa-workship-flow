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
      className="bg-white/80 dark:bg-inverse-surface/80 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-white/40 flex flex-col gap-4 relative overflow-visible"
      style={{ padding: '16px' }}
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
                className={cn("text-[9px] font-bold uppercase tracking-wider rounded-md shrink-0", getCategoryColorClass(song.category))}
                style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '2px', paddingBottom: '2px' }}
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
          variant="ghost"
          size="sm"
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full shadow-lg active:scale-90 transition-transform cursor-pointer p-0",
            isPlaying
              ? "text-white"
              : "text-primary shadow-sm"
          )}
          style={{
            padding: 0,
            backgroundColor: isPlaying ? '#7c3aed' : '#d6e4ff'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </Button>
      </div>

      {/* Player Progress */}
      <div className="space-y-1">
        <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${song.progressPct}%`,
              background: 'linear-gradient(135deg, #7c3aed 0%, #2170e4 100%)'
            }}
          />
        </div>
        <div
          className="flex justify-between text-[10px] text-outline font-semibold"
          style={{ marginTop: '2px' }}
        >
          <span>{song.progress}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Band Engagement */}
      <div
        className="border-t border-outline-variant/30"
        style={{ paddingTop: '8px', marginTop: '4px' }}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '6px' }}
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

      {/* Heard Checkbox Action */}
      <Button
        onClick={handleHeardClick}
        variant="ghost"
        className={cn(
          "w-full rounded-full font-label-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95",
          song.isHeard ? "text-white" : "text-primary"
        )}
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          marginTop: '4px',
          backgroundColor: song.isHeard ? '#630ed4' : 'transparent',
          border: song.isHeard ? 'none' : '1px solid #630ed4'
        }}
        leftIcon={
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: song.isHeard ? '"FILL" 1' : '"FILL" 0' }}
          >
            {song.isHeard ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        }
      >
        {song.isHeard ? 'Já ouvi' : 'Marcar como ouvida'}
      </Button>
    </div>
  );
};

export default SongCard;
