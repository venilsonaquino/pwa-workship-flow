import React, { useState } from 'react';
import SongDistribution, { CARDS_DATA } from '../components/SongDistribution';

// ── Data ─────────────────────────────────────────────────────────────────────

interface BandMember {
  role: string;
  name: string;
  icon: string;
}

interface SongItem {
  number: string;
  title: string;
  key: string;
}

const MEMBERS_DATA: BandMember[] = [
  { role: 'Teclado', name: 'Marcos Silva', icon: 'keyboard' },
  { role: 'Vocal 1', name: 'Ana Souza', icon: 'lyrics' },
  { role: 'Vocal 2', name: 'Carla Dias', icon: 'lyrics' },
  { role: 'Bateria', name: 'Tiago Rocha', icon: 'album' },
  { role: 'Baixo', name: 'Lucas Lima', icon: 'speaker_group' },
  { role: 'Violão', name: 'Gabriel M.', icon: 'music_note' },
];

const SONGS_DATA: SongItem[] = [
  { number: '01', title: 'Ousado Amor', key: 'E Major' },
  { number: '02', title: 'Tua Presença', key: 'G Major' },
  { number: '03', title: 'Digno', key: 'A Major' },
  { number: '04', title: 'Vim Para Adorar-te', key: 'D Major' },
  { number: '05', title: 'Que Se Abram Os Céus', key: 'C Major' },
  { number: '06', title: 'Aclame ao Senhor', key: 'G Major' },
];

const NEXT_EVENT = CARDS_DATA[0]; // Culto Manhã – DOM 08 Out

// ── Próxima Escala Banner ─────────────────────────────────────────────────────

const ProximaEscalaBanner: React.FC = () => {
  const totalMembers = MEMBERS_DATA.length;
  const totalSongs = SONGS_DATA.length;
  const shownAvatars = NEXT_EVENT.avatars.slice(0, 3);
  const extraCount = totalMembers - shownAvatars.length;

  return (
    <section className="flex flex-col gap-2 py-4">
      <p className="text-label-md font-label-md text-on-surface-variant tracking-wider font-headline-md text-headline-md text-on-surface">
        Próxima escala
      </p>

      {/* Primary banner card – reuses same gradient/radius from SongDistribution active card */}
      <div className="bg-primary rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
        {/* Top row: event badge + "Ver tudo" */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-label-sm font-label-sm text-on-primary opacity-80 uppercase tracking-wider leading-tight">
            {NEXT_EVENT.dayOfWeek} • {NEXT_EVENT.dateStr} • Culto de Celebração
          </p>
          <button
            type="button"
            className="shrink-0 bg-white/20 hover:bg-white/30 text-on-primary text-label-sm font-label-sm px-3 py-1 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            Ver tudo
          </button>
        </div>

        {/* Event title */}
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-primary">
            {NEXT_EVENT.title}
          </h2>
          <p className="text-label-sm text-on-primary opacity-80 mt-0.5">
            {totalMembers} Integrantes · {totalSongs} músicas
          </p>
        </div>

        {/* Avatars */}
        <div className="flex pt-1">
          {shownAvatars.map((url, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full border-2 border-primary overflow-hidden bg-surface-container-high ${idx > 0 ? '-ml-3' : ''}`}
            >
              <img
                alt={`Membro ${idx + 1}`}
                className="w-full h-full object-cover"
                src={url}
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="-ml-3 w-8 h-8 rounded-full border-2 border-primary bg-surface-container-lowest text-primary flex items-center justify-center text-[10px] font-bold">
              +{extraCount}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ── Integrantes Section ───────────────────────────────────────────────────────

const IntegrantesSection: React.FC = () => (
  <section className="flex flex-col gap-3">
    <p className="text-label-sm font-label-sm text-on-surface-variant">
      Integrantes · <span className="text-on-surface">{NEXT_EVENT.title}</span>
    </p>

    {/* 2-col grid – mesmos estilos do BandMembersGrid original */}
    <div className="grid grid-cols-2 gap-4 p-1">
      {MEMBERS_DATA.map((member, idx) => (
        <div
          key={idx}
          className="flex items-center bg-surface-container-low rounded-2xl border border-outline-variant/10 p-3 gap-3"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">
            {member.icon}
          </span>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              {member.role}
            </p>
            <p className="text-label-lg font-label-lg text-on-surface">
              {member.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ── Setlist Section ───────────────────────────────────────────────────────────

const SetlistSection: React.FC = () => (
  <section className="flex flex-col gap-3">
    <p className="text-label-lg font-label-lg text-primary uppercase tracking-widest text-center pb-2 border-b border-outline-variant">
      Setlist
    </p>

    <ul className="flex flex-col gap-3">
      {SONGS_DATA.map((song, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold w-6 h-6">
              {song.number}
            </span>
            <p className="text-body-lg font-semibold text-on-surface">
              {song.title}
            </p>
          </div>
          <span className="text-label-sm text-on-surface-variant shrink-0 ml-2">
            {song.key}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

// ── Main View ─────────────────────────────────────────────────────────────────

export const ScalesPreviewView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2023-10');

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      {/* 1. Próxima Escala */}
      <ProximaEscalaBanner />

      {/* 2. Escalas do mês – carousel */}
      <SongDistribution
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      />

      {/* 3. Integrantes */}
      <IntegrantesSection />

      {/* 4. Setlist */}
      <SetlistSection />

      {/* FAB - Nova Escala */}
      <button
        type="button"
        className="fixed bottom-24 right-6 gradient-brand text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-xl z-50 active:scale-95 transition-transform cursor-pointer font-bold text-label-lg"
      >
        <span className="material-symbols-outlined">add</span>
        Nova Escala
      </button>
    </div>
  );
};

export default ScalesPreviewView;
