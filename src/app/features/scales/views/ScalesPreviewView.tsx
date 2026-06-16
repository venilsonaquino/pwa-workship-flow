import React, { useState } from 'react';
import SongDistribution, { CARDS_DATA } from '../components/SongDistribution';
import { FloatingActionButton } from '@shared/components';

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
  { number: '01', title: 'Ousado Amor', key: 'E Maior' },
  { number: '02', title: 'Tua Presença', key: 'G Maior' },
  { number: '03', title: 'Digno', key: 'A Maior' },
  { number: '04', title: 'Vim Para Adorar-te', key: 'D Maior' },
  { number: '05', title: 'Que Se Abram Os Céus', key: 'C Maior' },
  { number: '06', title: 'Aclame ao Senhor', key: 'G Maior' },
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
      <div
        className="relative overflow-hidden rounded-3xl p-5 flex flex-col gap-3 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)',
        }}
      >
        {/* Concentric circles background elements */}
        <div className="absolute right-[-20px] bottom-[-20px] w-[100px] h-[100px] border border-white/20 rounded-full pointer-events-none" />
        <div className="absolute right-[40px] bottom-[-40px] w-[150px] h-[150px] border border-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Top row: event badge + "Ver tudo" */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-label-sm font-label-sm text-white opacity-80 uppercase tracking-wider leading-tight">
              {NEXT_EVENT.dayOfWeek} • {NEXT_EVENT.dateStr} • Culto de Celebração
            </p>
            <button
              type="button"
              className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-label-sm font-label-sm px-3 py-1 rounded-full transition-colors active:scale-95 cursor-pointer"
            >
              Ver tudo
            </button>
          </div>

          {/* Event title */}
          <div>
            <h2 className="font-headline-lg text-headline-lg text-white">
              {NEXT_EVENT.title}
            </h2>
            <p className="text-label-sm text-white opacity-80 mt-0.5">
              {totalMembers} Integrantes · {totalSongs} músicas
            </p>
          </div>

          {/* Avatars */}
          <div className="flex pt-1">
            {shownAvatars.map((url, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full border-2 border-[#7C3AED] overflow-hidden bg-surface-container-high ${idx > 0 ? '-ml-3' : ''}`}
              >
                <img
                  alt={`Membro ${idx + 1}`}
                  className="w-full h-full object-cover"
                  src={url}
                />
              </div>
            ))}
            {extraCount > 0 && (
              <div className="-ml-3 w-8 h-8 rounded-full border-2 border-[#7C3AED] bg-surface-container-lowest text-primary flex items-center justify-center text-[10px] font-bold">
                +{extraCount}
              </div>
            )}
          </div>
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
    <p className="text-label-lg font-label-lg text-primary tracking-widest text-center pb-2 border-b border-outline-variant">
      Louvores
    </p>

    <ul className="flex flex-col gap-3">
      {SONGS_DATA.map((song, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold w-6 h-6 shrink-0">
              {song.number}
            </span>
            <p className="text-body-lg font-semibold text-on-surface truncate">
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
    <div className="w-full flex flex-col gap-6 pb-40">
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
      <FloatingActionButton
        onClick={() => console.info('Nova Escala')}
        icon={<span className="material-symbols-outlined text-[20px]">add</span>}
        label="Nova Escala"
      />
    </div>
  );
};

export default ScalesPreviewView;
