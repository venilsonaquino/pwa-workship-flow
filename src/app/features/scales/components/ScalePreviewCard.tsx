import React from 'react';
import { Card, CardContent, CardFooter, Button } from '@shared/components';
import scaleBg from '@assets/ceia.png';


export interface BandMember {
  role: string;
  name: string;
  icon: string;
}

export interface SongItem {
  number: string;
  title: string;
  key: string;
}

const MEMBERS_DATA: BandMember[] = [
  { role: 'Teclado', name: 'Marcos Silva', icon: 'keyboard' },
  { role: 'Vocal 1', name: 'Ana Souza', icon: 'lyrics' },
  { role: 'Vocal 2', name: 'Carla Dias', icon: 'lyrics' },
  { role: 'Vocal 3', name: 'Pedro Santos', icon: 'lyrics' },
  { role: 'Baixo', name: 'Lucas Lima', icon: 'speaker_group' },
  { role: 'Bateria', name: 'Tiago Rocha', icon: 'album' },
  { role: 'Violão', name: 'Gabriel M.', icon: 'music_note' },
];

const SONGS_DATA: SongItem[] = [
  { number: '01', title: 'Ousado Amor', key: 'E Major' },
  { number: '02', title: 'Tua Presença', key: 'G Major' },
  { number: '03', title: 'Digno', key: 'A Major' },
  { number: '04', title: 'Vim Para Adorar-te', key: 'D Major' },
  { number: '05', title: 'Que Se Abram Os Céus', key: 'C Major' },
  { number: '06', title: 'Lindo És', key: 'A Major' },
  { number: '07', title: 'Aclame ao Senhor', key: 'G Major' },
];

interface BandMembersGridProps {
  members: BandMember[];
}

const BandMembersGrid: React.FC<BandMembersGridProps> = ({ members }) => {
  return (
    <div
      className="grid grid-cols-2 gap-4 p-1"
    >
      {members.map((member, idx) => (
        <div
          key={idx}
          className="flex items-center bg-surface-container-low rounded-2xl border border-outline-variant/10 p-3 gap-3"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">
            {member.icon}
          </span>
          <div>
            <p
              className="text-label-sm font-label-sm text-on-surface-variant"
            >
              {member.role}
            </p>
            <p className="text-label-lg font-label-lg text-on-surface">
              {member.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

interface SetlistListProps {
  songs: SongItem[];
}

const SetlistList: React.FC<SetlistListProps> = ({ songs }) => {
  return (
    <div className='flex flex-col gap-3'>
      <p
        className="text-label-lg font-label-lg text-primary uppercase tracking-widest text-center pb-2 border-b border-border"
      >
        Setlist
      </p>
      <ul className="flex flex-col gap-3">
        {songs.map((song, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                className="rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold w-6 h-6"
              >
                {song.number}
              </span>
              <p className="text-body-lg font-semibold text-on-surface">
                {song.title}
              </p>
            </div>
            <span
              className="text-label-sm text-on-surface-variant"
            >
              {song.key}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ScalePreviewCard: React.FC = () => {

  const handleShare = () => {
    const text = `📅 *Escala: Culto de Celebração (08/10)*\n\n` +
      `🎸 *Equipe:*\n` +
      MEMBERS_DATA.map(m => `- ${m.role}: ${m.name}`).join('\n') + `\n\n` +
      `🎵 *Setlist:*\n` +
      SONGS_DATA.map(s => `${s.number}. ${s.title} (${s.key})`).join('\n') + `\n\n` +
      `#WorshipFlow #EscalaDominical`;

    if (navigator.share) {
      navigator.share({
        title: 'Escala WorshipFlow',
        text: text,
      }).catch(err => console.info('[ScalePreview] Error sharing:', err));
    } else {
      navigator.clipboard.writeText(text)
        .then(() => console.info('[ScalePreview] Copied to clipboard'))
        .catch(err => console.error('[ScalePreview] Error copying:', err));
    }
  };

  const handleExport = () => {
    const text = `📅 *Escala: Culto de Celebração (08/10)*\n\n` +
      `🎸 *Equipe:*\n` +
      MEMBERS_DATA.map(m => `- ${m.role}: ${m.name}`).join('\n') + `\n\n` +
      `🎵 *Setlist:*\n` +
      SONGS_DATA.map(s => `${s.number}. ${s.title} (${s.key})`).join('\n') + `\n\n` +
      `#WorshipFlow #EscalaDominical`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Preview da Escala
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          iconOnly
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </Button>
      </div>

      <Card>
        <div className="relative h-36 -mb-[1px] bg-surface-container-lowest">
          <img
            alt="Scale Background"
            className="w-full h-full object-cover"
            src={scaleBg}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
          <div
            className="absolute bottom-4 left-6 flex flex-col gap-1"
          >
            <div>
              <span
                className="bg-primary text-white text-[10px] rounded-full font-bold uppercase tracking-widest inline-block px-2 py-0.5 mb-1"
              >
                Culto de Celebração
              </span>
            </div>
            <h4 className="text-headline-md font-headline-md text-on-surface">
              Domingo, 08 de Outubro
            </h4>
          </div>
        </div>

        <CardContent className="flex flex-col gap-6 p-6">
          <BandMembersGrid members={MEMBERS_DATA} />
          <SetlistList songs={SONGS_DATA} />
        </CardContent>

        <CardFooter className="bg-surface-container-high border-t border-outline-variant/10 flex justify-between items-center py-3 px-6">
          <p
            className="text-label-sm font-medium italic text-on-surface-variant"
          >
            #ArvoreDeVida #Escala
          </p>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-primary text-[16px] icon-fill"
            >
              favorite
            </span>
            <span className="text-[10px] font-bold text-primary">ADM MANU</span>
          </div>
        </CardFooter>
      </Card>

      <section className="flex flex-col gap-4">
        <Button
          onClick={handleExport}
          variant="primary"
          size="lg"
          isFullWidth
          leftIcon={<span className="material-symbols-outlined text-[20px]">download</span>}
        >
          Exportar para WhatsApp
        </Button>
      </section>

    </section>
  );
};

export default ScalePreviewCard;
