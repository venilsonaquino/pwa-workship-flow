import React from 'react';

export interface EventCard {
  id: string;
  dayOfWeek: string;
  dateStr: string;
  title: string;
  songsCount: number;
  avatars: string[];
  extraAvatarsCount?: number;
  isActive?: boolean;
}

const CARDS_DATA: EventCard[] = [
  {
    id: '1',
    dayOfWeek: 'DOM',
    dateStr: '08 Out',
    title: 'Culto Manhã',
    songsCount: 4,
    isActive: true,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASmRq5dvksI_1fkhttqANKJtjIQ6cbdR3SjN0jI9GkwtYawkNXzIvPOQoXaYl4dRTaEVX1j8aBKdfhvQa_96XZfFpSOQY-QoktK3JbChzV3Ug_tC3NRtCjW7JYq5C7M2jkPsaQCTphTDVOi05o5Qtf2_H5mtgSbng9ehvSijuF8I6fo4dSFRAVSChTTQFi1VVHGrGfh_CuHGiKI5WDOeaM06Bj3BUsLotBetX8koCqRXjz_PpardnMmWSi4fxsE0Jj7W1jhgN6b18',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyc0Fuu4RuLNAi7nEjcBO1hKsWksf78zQcOk8AyqX3vm7NAvrAZKl_PpyHc_GZuYZDBh-VaAunDQiCmgQDZ5bQg38l4BXx6hMUb_mzQH6g6xVH-pFS9Tsk0oOeiMiCjC50fljv-LmO10iWvh3p3_rJr9Wf7LqBqpxp2kOt7CATUL-Z2APtR-MNH46GVwp8g_n2b1bw-NMFYWDYDhuD_4QIX5Fh0fq_CO-cCeBqukefBbDg1vlVzciKYJziDAM2n7B-O4KCdrLaEk',
    ],
    extraAvatarsCount: 2,
  },
  {
    id: '2',
    dayOfWeek: 'QUA',
    dateStr: '11 Out',
    title: 'Ensaio Geral',
    songsCount: 3,
    isActive: false,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9_rnKrNQuJgGCv2xHE2gM_4gyNJn-mRH4rewbrEwhv0fOfMEqiIqdFxoLGByrXbpR_jpghhWTV7tTo15ngK2lU0nYJXfIWYUGAg9Cbr64Y5srbm7j2gmbePnhPvzd6bw3s9c44AyVdqJsm5f38Mr6faSchqNDyIGGoviVVGHfBocn8t-WZ9OO_KzJCaDIiJFzjNTVpPLSGB6rlFr3TeegE4kgTW2b34xGtfqD8CZvqnxdsYCk0tSEDMYzE6qvaA5iL3zX_ORm2zQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfQyfgPhtGlrPvQkRxHyDUtvwtamFvnJabFY85MImEjdIWsUlevmDyu3sKObipN0nY5eMNSg39H7szAgYmN9f_09duSeq4VYudUQj9l5gPW2Fjbtnf7vQUO_feLf1kGCOOqNxI7zPjj44YIB47erhxrcxv0KwODLLRdvlWJT_zRBDBYe6EJF2DUUFtSNAt0g9xvIrYO0MITOQ_iIQAIz52WFJCEtQGdnCRqgxwK8LoG1Z6c6j1wfx-32bAvLKkr2Pyi6YWZVosXFY',
    ],
  },
  {
    id: '3',
    dayOfWeek: 'DOM',
    dateStr: '15 Out',
    title: 'Culto Noite',
    songsCount: 5,
    isActive: false,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbHu_6E7Jk51uOTMZJrqYtJDnHqqwxeI4SuqL6GPSc3siAjiOWWJiP1i1R5aRtKM2e5p-3K3HducraBQg3eywMhqNW5gMeGfNwkN_C0sdamzRyDT1DHjCc-4hpdjBQtBNMWh1_V5wuHw_MV5tp5U9FXTnySHEizaLKQFAv9G7ToKC4rF3znOE9RGxQhJy__rW38HXPQ2gEfCLO0XE1DOMUhdtkj5LUAc8PGpk523vHJ_9uoeLqyY946jBC9MDyTnoSymq49V3f64',
    ],
    extraAvatarsCount: 5,
  },
];

export const SongDistribution: React.FC = () => {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Distribuição de Músicas
        </h3>
        <button
          type="button"
          className="text-primary font-label-lg text-label-lg flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
        >
          Ver tudo
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div
        className="flex overflow-x-auto scrollbar-hide snap-x"
        style={{ paddingBottom: '16px', gap: '16px' }}
      >
        {CARDS_DATA.map((card) => {
          const isPrimary = card.isActive;
          return (
            <div
              key={card.id}
              className={`snap-center min-w-[140px] rounded-3xl flex-shrink-0 transition-all select-none border ${isPrimary
                  ? 'bg-primary text-on-primary border-primary shadow-lg'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 custom-shadow'
                }`}
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {/* Day & Date info */}
              <p
                className="text-label-sm font-label-sm uppercase tracking-wider"
                style={{ opacity: isPrimary ? 0.8 : 1, color: isPrimary ? 'inherit' : 'var(--color-on-surface-variant)' }}
              >
                {card.dayOfWeek} • {card.dateStr}
              </p>

              {/* Title and Song Count */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p className="font-bold text-lg leading-tight">{card.title}</p>
                <p
                  className="text-label-sm"
                  style={{ opacity: isPrimary ? 0.9 : 1, color: isPrimary ? 'inherit' : 'var(--color-on-surface-variant)' }}
                >
                  {card.songsCount} Músicas
                </p>
              </div>

              {/* Volunteers list */}
              <div
                className="flex"
                style={{ paddingTop: '4px' }}
              >
                {card.avatars.map((url, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full border-2 overflow-hidden bg-surface-container-high ${isPrimary ? 'border-primary' : 'border-surface-container-lowest'
                      }`}
                    style={idx > 0 ? { marginLeft: '-12px' } : undefined}
                  >
                    <img
                      alt={`Voluntário ${idx + 1}`}
                      className="w-full h-full object-cover"
                      src={url}
                    />
                  </div>
                ))}
                {card.extraAvatarsCount !== undefined && card.extraAvatarsCount > 0 && (
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isPrimary
                        ? 'border-primary bg-surface-container-lowest text-primary'
                        : 'border-surface-container-lowest bg-surface-container-lowest text-primary'
                      }`}
                    style={{ marginLeft: '-12px' }}
                  >
                    +{card.extraAvatarsCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SongDistribution;
