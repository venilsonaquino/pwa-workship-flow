import React from 'react';

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

export const ScalePreviewCard: React.FC = () => {
  const scaleBg = 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=600&auto=format&fit=crop';

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
    <>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header with Title & Share */}
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Preview da Escala
          </h3>
          <button
            type="button"
            onClick={handleShare}
            className="bg-primary/10 text-primary rounded-xl hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            style={{ padding: '8px' }}
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>

        {/* Beautiful Scale Export Card */}
        <div className="relative bg-surface-container-lowest rounded-[32px] overflow-hidden custom-shadow border border-outline-variant/30">
          {/* Card Header with Image */}
          <div className="relative h-36" style={{ position: 'relative', height: '144px' }}>
            <img
              alt="Scale Background"
              className="w-full h-full object-cover"
              src={scaleBg}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
            <div
              className="absolute"
              style={{ bottom: '16px', left: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <div>
                <span
                  className="bg-primary text-white text-[10px] rounded-full font-bold uppercase tracking-widest inline-block"
                  style={{ padding: '2px 8px', marginBottom: '4px' }}
                >
                  Culto de Celebração
                </span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">
                Domingo, 08 de Outubro
              </h4>
            </div>
          </div>

          {/* Card Content */}
          <div
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Band Members Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '16px',
              }}
            >
              {MEMBERS_DATA.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-surface-container-low rounded-2xl border border-outline-variant/10"
                  style={{ padding: '12px', gap: '12px' }}
                >
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    {member.icon}
                  </span>
                  <div>
                    <p
                      className="text-label-sm font-label-sm"
                      style={{ color: 'var(--color-on-surface-variant)' }}
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

            {/* Song List (Setlist) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p
                className="text-label-lg font-label-lg text-primary uppercase tracking-widest text-center"
                style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}
              >
                Setlist
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SONGS_DATA.map((song, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <span
                        className="rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold"
                        style={{ width: '24px', height: '24px' }}
                      >
                        {song.number}
                      </span>
                      <p className="text-body-lg font-semibold text-on-surface">
                        {song.title}
                      </p>
                    </div>
                    <span
                      className="text-label-sm"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {song.key}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Export Footer */}
          <div
            className="bg-surface-container-high border-t border-outline-variant/10"
            style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <p
              className="text-label-sm font-medium italic"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              #WorshipFlow #EscalaDominical
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                className="material-symbols-outlined text-primary text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span className="text-[10px] font-bold text-primary">ADM MANU</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="relative h-36" style={{ position: 'relative', height: '156px' }}>
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #630ed4 100%)',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar para WhatsApp
          </button>
        </div>
      </section>
    </>
  );
};

export default ScalePreviewCard;
