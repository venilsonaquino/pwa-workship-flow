import { useEffect } from 'react';
import { useAuth, Permission } from '@shared/hooks/useAuth';
import type { Song } from '../domain/entities/Song';

export interface EngagementDrawerProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
  onViewCifra?: (song: Song) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatListenedAt(dateStr: string): string {
  if (!dateStr) return 'Já ouviu';
  try {
    const d = new Date(dateStr);
    return `Ouviu em ${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'Já ouviu';
  }
}

export const EngagementDrawer = ({
  isOpen,
  song,
  onClose,
  onViewCifra,
}: EngagementDrawerProps) => {
  const { hasPermission } = useAuth();
  const canViewListeners = hasPermission(Permission.SongViewListeners);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !song) return null;

  const searchTerms = encodeURIComponent(`${song.title} ${song.artist}`);
  const cifraclubUrl = `https://www.cifraclub.com.br/?q=${searchTerms}`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${song.videoId}`;
  const letrasUrl = `https://www.letras.mus.br/?q=${searchTerms}`;

  const hasListens = song.listens && song.listens.length > 0;
  const isProcessing = song.status === 'pending' || song.status === 'processing';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[990] transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] bg-surface rounded-t-[32px] shadow-lg flex flex-col max-h-[85vh] overflow-hidden animate-slide-up-mobile">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 bg-outline-variant/50 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 flex items-center justify-between border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Detalhes</h2>
            <p className="text-label-sm text-primary"></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center"
            aria-label="Fechar drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Member List & External Links */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-24">
          <div className="space-y-4">
            {canViewListeners && (hasListens ? (
              song.listens.map((listen) => (
                <div key={listen.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold text-body-lg shrink-0 border border-primary/20">
                      {listen.userAvatarUrl ? (
                        <img
                          src={listen.userAvatarUrl}
                          alt={listen.userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        getInitials(listen.userName)
                      )}
                    </div>
                    <div>
                      <p className="font-label-lg text-on-surface">{listen.userName}</p>
                      <p className="text-[11px] text-on-surface-variant/80">{formatListenedAt(listen.listenedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-primary font-medium">
                    <span className="material-symbols-outlined text-[20px] icon-fill">
                      check_circle
                    </span>
                    <span className="text-label-sm">Já ouviu</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-on-surface-variant/70 gap-2">
                <span className="material-symbols-outlined text-[36px] text-outline">group_off</span>
                <p className="text-body-md font-medium text-on-surface/80">
                  Nenhum integrante ouviu essa música ainda.
                </p>
              </div>
            ))}
          </div>

          {/* Cifra Reader Section */}
          {(song.cifra || isProcessing) && (
            <div className="pt-6 border-t border-outline-variant/30">
              <h3 className="text-label-sm font-bold text-outline mb-4 tracking-wider uppercase">
                Cifra
              </h3>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  if (isProcessing) return;
                  onViewCifra?.(song);
                  onClose();
                }}
                className={isProcessing
                  ? "w-full flex items-center justify-between p-3 bg-surface-container-high/50 border border-outline-variant/20 rounded-xl text-outline cursor-not-allowed opacity-65"
                  : "w-full flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl shadow-sm hover:bg-primary/10 transition-all duration-200 active:scale-[0.98]"
                }
              >
                <div className="flex items-center gap-3">
                  <div className={isProcessing ? "w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-outline" : "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary"}>
                    <span className={`material-symbols-outlined text-[20px] ${isProcessing ? 'animate-spin' : ''}`}>
                      {isProcessing ? 'progress_activity' : 'piano'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={isProcessing ? "font-label-lg text-outline" : "font-label-lg text-on-surface"}>
                      {isProcessing ? 'Preparando cifra...' : 'Visualizar Cifra'}
                    </p>
                    <p className="text-[10px] text-outline">
                      {isProcessing ? 'Disponível quando o processamento terminar' : 'Acordes e letra'}
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[20px] ${isProcessing ? 'text-outline' : 'text-primary'}`}>
                  {isProcessing ? 'hourglass_empty' : 'chevron_right'}
                </span>
              </button>
            </div>
          )}

          {/* External Links Section */}
          <div className="pt-6 border-t border-outline-variant/30">
            <h3 className="text-label-sm font-bold text-outline mb-4 tracking-wider uppercase">
              Links Externos
            </h3>
            <div className="space-y-3">
              <a
                href={song.cifraClubUrl ?? cifraclubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">music_note</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-on-surface">Cifraclub</p>
                    <p className="text-[10px] text-outline">Cifras e acordes</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">open_in_new</span>
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-[20px]">play_circle</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-on-surface">YouTube</p>
                    <p className="text-[10px] text-outline">Vídeo aula e clipe</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">open_in_new</span>
              </a>

              <a
                href={song.letrasUrl ?? letrasUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">lyrics</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-on-surface">Letras.mus.br</p>
                    <p className="text-[10px] text-outline">Letra completa</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EngagementDrawer;
