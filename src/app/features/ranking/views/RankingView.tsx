import { useState } from 'react';
import { Header } from '@shared/components';

interface RankingSong {
  id: string;
  rank: number;
  title: string;
  artist: string;
  executions: number;
  trend: {
    type: 'up' | 'down' | 'stable';
    value?: string;
  };
  image?: string;
}

// Full mock database of executions to compute dynamic rankings based on Day and Period filters
const BASE_SONGS: Record<string, { title: string; artist: string; image?: string; dailyExecutions: Record<string, number> }> = {
  'oceans': {
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4W5u0LqMvotvxAt447ia6eBiDEVLy3hlVbMMY5zXBCBjk9h-URUc44pnk8CpzVOXW0eXPLPbrpIbTEIGYMX3vM1KsJyNwKBoFnpO9xWTkpmEbvrLZjTfBEfkIUJUr7X8iv-fW0Xvo0HLxRVxsdZbHjLUelcELFMHhUiQjr6Xmjc886GSTC69Nf8kwWT2AUFd9hTX5BVopnQ4ChoabvXQrVR2UxrAdttRyqOLlp5jpXEJ2q8i_44xm4oHk2Uh__l2QZAYN5fYuttA',
    dailyExecutions: { Dom: 18, Qua: 12, Sex: 12 }
  },
  'waymaker': {
    title: 'Way Maker',
    artist: 'Sinach',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMh9AWWN_Lj7C7cjkbdjaCH3QM0t8X2uXustx29f48e3A6Bjxk0SGzvFIsRf9YV6714fGJt9zvvmqo9fg--QK9-MvB1vE_4fkH-JB-iWoL78pHg-UTe8rIjxZXvGvu9ONLueKbz8bfeab2xPSy2dcg46oeZk_fyPLgAje1tGbpwIQinMZT8_voZgg1ib9tgkeb58WreHAqbaEB2bpzBaV4sSpj8gytFLI1JafuzAi00s11BkPnF0foYnBcUAifsTk4TsbZm1zOhy4',
    dailyExecutions: { Dom: 14, Qua: 14, Sex: 10 }
  },
  'goodness': {
    title: 'Goodness of God',
    artist: 'Bethel Music',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfn1PxZqmz1w5AEfvOfSu-qfLSgFCCdte9w3WAIA9Ac17FVltlZDM8bFxSsHnsUoIFbb7BSEIPcJEVtWeKcB_O-TZcrg0EiKUgBeQesi_YUJiUQxm4kBdSDzsx2Q06Ic3KHrqcflPVAhe93BiBN9cF1YRTfD50T_t84uUhIbO_Fa9ZmwbLQhOaKWMySn_Um616WXFDmcV8hxCiO87Z-9AzKe1Qycgkfwn-tWlcCnEmnGkjH2WdtWbgZ4Xg5pP-qSvPS3mr0PosZ_0',
    dailyExecutions: { Dom: 20, Qua: 8, Sex: 7 }
  },
  'reasons': {
    title: '1,000 Reasons',
    artist: 'Matt Redman',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8tiCVlPlh0HZKnHDtHp9tFCbsnGII8HvWyE58epMSLVl5hM2u84ApEcLg7onHGW8efSACLyUGO-SI6IlQtTX0KZLfTGimK6nPqKD_W2zKko0bvOGbxDxN4B2JW-8bnnp1EtKKGPr1m8i5CmNZeziWkSTaiCUTxFHr8IEjjEQ8N-1i8ljJ7QFl5Ia3Lesvmftz36wznFJz-qKuo5LtIz1aY-0Ve0Yz1cTMzXbxnJOrmh-yOp0FqN3iu1oD7axSlgvF19c0psgzPs',
    dailyExecutions: { Dom: 11, Qua: 10, Sex: 10 }
  },
  'reckless': {
    title: 'Reckless Love',
    artist: 'Cory Asbury',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEGhzvrNmTWtha_OGP2Huez2vNZO7N-GIt1OGf_O-aM6bLFbLowAqu6Gy7axBrbdx_TYO14YA2CZau0RfRoEmBMOSa53qNf43C0rlyAPheZ3r0UeurKihJT95oVVdfnFUo47kMKoTK0fx_WeaE_P0YAMDWgPZlexhoD8wroFLlDynhe-Bd9g_3FxFHTbq8EbZ9KkrN3i5fik3k4NrcICP5Yp4JK6PLhGrUz-qJmjO1yuqSuA245t3q9EWyRQD6fJ4Qkppp4Sokn5Q',
    dailyExecutions: { Dom: 12, Qua: 9, Sex: 8 }
  },
  'beautiful': {
    title: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    dailyExecutions: { Dom: 10, Qua: 9, Sex: 8 }
  }
};

const DAYS = [
  { id: 'Todas', label: 'Todas' },
  { id: 'Dom', label: 'Dom' },
  { id: 'Qua', label: 'Qua' },
  { id: 'Sex', label: 'Sex' }
];

const PERIODS = [
  { id: '7d', label: '7 dias', multiplier: 0.25 },
  { id: '30d', label: '30 dias', multiplier: 1.0 },
  { id: '3m', label: '3 meses', multiplier: 3.0 },
  { id: '1y', label: '1 ano', multiplier: 12.0 }
];

export const RankingView: React.FC = () => {
  const [activeDay, setActiveDay] = useState('Todas');
  const [activePeriod, setActivePeriod] = useState('30d');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Calculate executions based on active period and day filters
  const periodConfig = PERIODS.find(p => p.id === activePeriod) || PERIODS[1];
  const multiplier = periodConfig.multiplier;

  // Build ranking list
  const songs: RankingSong[] = Object.entries(BASE_SONGS).map(([key, data]) => {
    const executions = activeDay === 'Todas'
      ? Object.values(data.dailyExecutions).reduce((a, b) => a + b, 0)
      : (data.dailyExecutions[activeDay] || 0);

    // Multiply executions to simulate periods
    const calculatedExecutions = Math.round(executions * multiplier);

    // Dynamic mock trends based on song keys to give unique trends matching design
    let trend: { type: 'up' | 'down' | 'stable'; value?: string } = { type: 'stable' };
    if (key === 'waymaker') trend = { type: 'up', value: '15%' };
    else if (key === 'goodness') trend = { type: 'up', value: '8%' };
    else if (key === 'reasons') trend = { type: 'down', value: '5%' };
    else if (key === 'reckless') trend = { type: 'up', value: '12%' };

    return {
      id: key,
      rank: 0, // calculated next
      title: data.title,
      artist: data.artist,
      executions: calculatedExecutions,
      trend,
      image: data.image
    };
  });

  // Sort and apply rank number
  songs.sort((a, b) => b.executions - a.executions);
  songs.forEach((song, index) => {
    song.rank = index + 1;
  });

  const heroSong = songs[0];
  const remainingSongs = songs.slice(1);

  const togglePlaySong = (songId: string) => {
    setPlayingSongId(prev => prev === songId ? null : songId);
  };

  return (
    <div className="flex flex-col w-full bg-background text-on-background pb-32">
      <Header
        title="Ranking"
        showNotification={true}
      />

      <main className="space-y-6 max-w-lg mx-auto w-full">
        {/* Filters Section */}
        <section className="space-y-4">
          {/* Row 1: Days Tabs */}
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-1 border-b border-outline-variant/30 py-3 justify-center">
            {DAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`relative pb-2 text-label-lg whitespace-nowrap transition-all duration-200 ${activeDay === day.id
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                  : 'text-on-surface-variant font-medium hover:text-on-surface'
                  }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Row 2: Period Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1 justify-center">
            {PERIODS.map(period => (
              <button
                key={period.id}
                onClick={() => setActivePeriod(period.id)}
                className={`px-4 py-2 rounded-full text-label-sm whitespace-nowrap border transition-all duration-200 ${activePeriod === period.id
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold border-transparent shadow-sm'
                  : 'border-outline text-on-surface-variant hover:border-on-surface-variant hover:text-on-surface'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </section>

        {/* Card Hero (#1 Ranking) */}
        {heroSong && (
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 text-white shadow-xl animate-fade-in-up">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-tight mb-4 select-none">
                  ⭐ #1 do ranking
                </span>
                <div className="flex gap-4 items-end">
                  {heroSong.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                      <img
                        alt={`Capa do álbum de ${heroSong.title}`}
                        className="w-full h-full object-cover"
                        src={heroSong.image}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pb-1">
                    <h2 className="font-headline-md text-headline-md leading-tight text-white truncate">
                      {heroSong.title}
                    </h2>
                    <p className="text-white/80 text-body-md truncate">{heroSong.artist}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold">execuções</p>
                  <p className="text-2xl font-bold">{heroSong.executions}</p>
                  <p className="text-[10px] text-white/50">
                    {activePeriod === '7d' && 'últimos 7 dias'}
                    {activePeriod === '30d' && 'últimos 30 dias'}
                    {activePeriod === '3m' && 'últimos 3 meses'}
                    {activePeriod === '1y' && 'último 1 ano'}
                  </p>
                </div>
                <button
                  onClick={() => togglePlaySong(heroSong.id)}
                  className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center active:scale-90 transition-transform duration-200 bg-white/10 hover:bg-white/20"
                  aria-label={playingSongId === heroSong.id ? 'Pausar' : 'Tocar'}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {playingSongId === heroSong.id ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
            {/* Decorative circle */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          </section>
        )}

        {/* Top 10 List */}
        <section className="space-y-3">
          {remainingSongs.map((song, index) => {
            const isPlaying = playingSongId === song.id;
            return (
              <div
                key={song.id}
                onClick={() => togglePlaySong(song.id)}
                className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-xl shadow-sm hover:bg-surface-container transition-all duration-200 cursor-pointer active:scale-[0.99] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="w-6 text-center font-bold text-primary font-headline-md">{song.rank}</span>
                <div className="w-12 h-12 rounded-lg bg-surface-dim overflow-hidden flex-shrink-0 relative group">
                  {song.image ? (
                    <img
                      className="w-full h-full object-cover"
                      alt={`Capa do álbum de ${song.title}`}
                      src={song.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-surface-variant to-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary/40 select-none">music_note</span>
                    </div>
                  )}
                  {/* Hover overlay for playing status */}
                  <div className={`absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="material-symbols-outlined text-white text-[20px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate text-body-lg ${isPlaying ? 'text-primary' : 'text-on-surface'}`}>
                    {song.title}
                  </p>
                  <p className="text-label-sm text-on-surface-variant truncate">{song.artist}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-on-surface text-body-lg">{song.executions}</p>
                  {song.trend.type === 'up' && (
                    <p className="text-[11px] text-success font-semibold flex items-center justify-end gap-0.5">
                      <span className="material-symbols-outlined text-[10px] font-bold">arrow_upward</span>
                      {song.trend.value}
                    </p>
                  )}
                  {song.trend.type === 'down' && (
                    <p className="text-[11px] text-error font-semibold flex items-center justify-end gap-0.5">
                      <span className="material-symbols-outlined text-[10px] font-bold">arrow_downward</span>
                      {song.trend.value}
                    </p>
                  )}
                  {song.trend.type === 'stable' && (
                    <p className="text-[11px] text-on-surface-variant opacity-80 font-medium">estável</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default RankingView;
