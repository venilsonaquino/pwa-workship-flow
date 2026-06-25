import { useEffect } from 'react';
import type { Song } from '../types';

export interface EngagementDrawerProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
  onViewCifra?: (song: Song) => void;
}

interface Member {
  name: string;
  role: string;
  initials: string;
  status: 'heard' | 'pending' | 'dynamic';
  avatarBgClass: string;
  avatarTextClass: string;
}

const BAND_MEMBERS: Member[] = [
  {
    name: 'João Silva',
    role: 'Vocal',
    initials: 'JS',
    status: 'heard',
    avatarBgClass: 'bg-primary-fixed',
    avatarTextClass: 'text-on-primary-fixed font-bold'
  },
  {
    name: 'Maria Costa',
    role: 'Guitarra',
    initials: 'MC',
    status: 'heard',
    avatarBgClass: 'bg-secondary-fixed',
    avatarTextClass: 'text-on-secondary-fixed font-bold'
  },
  {
    name: 'Manu Silveira (Você)',
    role: 'Líder de Louvor',
    initials: 'MS',
    status: 'dynamic',
    avatarBgClass: 'bg-primary/20',
    avatarTextClass: 'text-primary font-bold'
  },
  {
    name: 'Ricardo Pereira',
    role: 'Bateria',
    initials: 'RP',
    status: 'pending',
    avatarBgClass: 'bg-surface-container-highest',
    avatarTextClass: 'text-on-surface-variant font-bold'
  },
  {
    name: 'Ana Lima',
    role: 'Teclado',
    initials: 'AL',
    status: 'heard',
    avatarBgClass: 'bg-tertiary-fixed',
    avatarTextClass: 'text-on-tertiary-fixed font-bold'
  }
];

export const EngagementDrawer = ({
  isOpen,
  song,
  onClose,
  onViewCifra,
}: EngagementDrawerProps) => {

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
  const youtubeUrl = `https://www.youtube.com/results?search_query=${searchTerms}`;
  const letrasUrl = `https://www.letras.mus.br/?q=${searchTerms}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[990] transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] bg-surface rounded-t-[32px] shadow-lg flex flex-col max-h-[85vh] overflow-hidden animate-slide-up-mobile"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 bg-outline-variant/50 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 flex items-center justify-between border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Engajamento da Equipe</h2>
            <p className="text-label-sm text-primary">{song.title}</p>
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
            {BAND_MEMBERS.map((member) => {
              const hasHeard =
                member.status === 'heard' ||
                (member.status === 'dynamic' && song.isHeard);

              return (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-body-lg ${member.avatarBgClass} ${member.avatarTextClass}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-label-lg text-on-surface">{member.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{member.role}</p>
                    </div>
                  </div>

                  {hasHeard ? (
                    <div className="flex items-center gap-1 text-primary">
                      <span
                        className="material-symbols-outlined text-[20px] icon-fill"
                      >
                        check_circle
                      </span>
                      <span className="text-label-sm">Já ouvi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        schedule
                      </span>
                      <span className="text-label-sm">Pendente</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cifra Reader Section */}
          {song.cifra && (
            <div className="pt-6 border-t border-outline-variant/30">
              <h3 className="text-label-sm font-bold text-outline mb-4 tracking-wider uppercase">
                Cifra
              </h3>
              <button
                onClick={() => { onViewCifra?.(song); onClose(); }}
                className="w-full flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl shadow-sm hover:bg-primary/10 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">piano</span>
                  </div>
                  <div className="text-left">
                    <p className="font-label-lg text-on-surface">Visualizar Cifra</p>
                    <p className="text-[10px] text-outline">Tom: {song.tom ?? '—'} · Acordes e letra</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px]">chevron_right</span>
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
                href={cifraclubUrl}
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
                href={letrasUrl}
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
