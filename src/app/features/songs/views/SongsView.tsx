import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SongsFilterTabs from '../components/SongsFilterTabs';
import SongCard from '../components/SongCard';
import SongSearchView from './SongSearchView';
import EngagementDrawer from '../components/EngagementDrawer';
import { PageHeader, Button, FloatingActionButton } from '@shared/components';
import type { Song } from '../types';

const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Elevando a Alma',
    artist: 'Ministério de Louvor Central',
    category: 'sugestao',
    duration: '3:55',
    progress: '1:42',
    progressPct: 45,
    engagement: 85,
    isHeard: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Oeg-HSsmOqqLbpXgax9esSSi_MT7jCbWXIcl7AKDitPkcl1sG5jC0_zSzrx5k6nSMIyV8xuWKB5Ua02xSOK7LkgP8eOvmp22rAfvPPoUCKB5odE6VYp22xX2KQwWv7iYo0YEMBUP96E8GoKghcgzPEpqy9NKJU_bXrvZT7Zr95Ag9WohKbseD0AFxTTBWrcFbFGE3gEg-lw0nkd5EwyQAxE3N3AZfzVhxqBLTS1yNmCz2Pq0mD5VGcJ4z8Rkfyy-GeuFbS4j_Wc',
    suggestedBy: 'Ana'
  },
  {
    id: '2',
    title: 'Caminho da Fé',
    artist: 'Banda Aliança Divina',
    category: 'ensaiando',
    duration: '4:20',
    progress: '0:00',
    progressPct: 0,
    engagement: 32,
    isHeard: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkho2CSAxgcg1CqdSQr4Csgzx81ZOvAoJMHn36m9a24RntZJ0JFtMfYLXIW-_kk1EDqhViu6zyeDFTRF6kvX9RCYmcE8vnokek8ZH_Q30EofVUFfPYSsymIqrPAv6mQaQGl-gW-SohcXpw-4bNKknxgwLRdHMJ9p22go6l-mG4_qTWYrYMqUnhdF-uRCRZC_ehoGBYZwvWJFWi1QVTVJQ2918bNK10Yruc0ZTbT1itty4j33ClUnm2KmwisFif_O2oQOAGYLFsdkE',
    suggestedBy: 'Carlos'
  },
  {
    id: '3',
    title: 'Novo Horizonte',
    artist: 'Lucas Silva & Coral',
    category: 'repertorio',
    duration: '5:10',
    progress: '0:45',
    progressPct: 15,
    engagement: 60,
    isHeard: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALCrNCLEQ5NjxCGUxaWSq9OAKXIaem26b92DCKQkogAxGq1WWxTGHBZwjsYFxkVimhW8VQQDocI6y0UKPCqb2GxjoacjLWcMSNYzocqHMmujXNj5s5pklgmJNzqmjwDFrdbq4QDt0fpM1LpY8-eAqjkGF7Q5zo-RgDvGbvamsL7I-oE-WwBqj0xez8rwxLNDzYhhufYthY9Nq-7q80uLAf7sE7UN3TDFdaL9hLqt81Pccd5o5czdRezuQJV5cbTAWIx_Aaiq-Q2Q',
    suggestedBy: 'você'
  },
  {
    id: '4',
    title: 'Oceanos',
    artist: 'Ana Nóbrega',
    category: 'ensaiando',
    duration: '8:30',
    progress: '3:15',
    progressPct: 38,
    engagement: 75,
    isHeard: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Oeg-HSsmOqqLbpXgax9esSSi_MT7jCbWXIcl7AKDitPkcl1sG5jC0_zSzrx5k6nSMIyV8xuWKB5Ua02xSOK7LkgP8eOvmp22rAfvPPoUCKB5odE6VYp22xX2KQwWv7iYo0YEMBUP96E8GoKghcgzPEpqy9NKJU_bXrvZT7Zr95Ag9WohKbseD0AFxTTBWrcFbFGE3gEg-lw0nkd5EwyQAxE3N3AZfzVhxqBLTS1yNmCz2Pq0mD5VGcJ4z8Rkfyy-GeuFbS4j_Wc',
    suggestedBy: 'Mariana'
  },
  {
    id: '5',
    title: 'Ruínas',
    artist: 'Alessandro Vilas Boas',
    category: 'sugestao',
    duration: '6:10',
    progress: '0:00',
    progressPct: 0,
    engagement: 18,
    isHeard: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkho2CSAxgcg1CqdSQr4Csgzx81ZOvAoJMHn36m9a24RntZJ0JFtMfYLXIW-_kk1EDqhViu6zyeDFTRF6kvX9RCYmcE8vnokek8ZH_Q30EofVUFfPYSsymIqrPAv6mQaQGl-gW-SohcXpw-4bNKknxgwLRdHMJ9p22go6l-mG4_qTWYrYMqUnhdF-uRCRZC_ehoGBYZwvWJFWi1QVTVJQ2918bNK10Yruc0ZTbT1itty4j33ClUnm2KmwisFif_O2oQOAGYLFsdkE',
    suggestedBy: 'você'
  },
  {
    id: '6',
    title: 'Promessas',
    artist: 'Ministério Zoe',
    category: 'repertorio',
    duration: '5:50',
    progress: '5:50',
    progressPct: 100,
    engagement: 95,
    isHeard: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALCrNCLEQ5NjxCGUxaWSq9OAKXIaem26b92DCKQkogAxGq1WWxTGHBZwjsYFxkVimhW8VQQDocI6y0UKPCqb2GxjoacqjLWcMSNYzocqHMmujXNj5s5pklgmJNzqmjwDFrdbq4QDt0fpM1LpY8-eAqjkGF7Q5zo-RgDvGbvamsL7I-oE-WwBqj0xez8rwxLNDzYhhufYthY9Nq-7q80uLAf7sE7UN3TDFdaL9hLqt81Pccd5o5czdRezuQJV5cbTAWIx_Aaiq-Q2Q',
    suggestedBy: 'Pedro'
  }
];

export interface SongsViewProps {
  onBack: () => void;
}

export const SongsView = ({ onBack }: SongsViewProps) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'sugestao' | 'ensaiando' | 'repertorio'>('sugestao');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [songsList, setSongsList] = useState<Song[]>(INITIAL_SONGS);
  const [showSearchView, setShowSearchView] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [selectedSongForDrawer, setSelectedSongForDrawer] = useState<Song | null>(null);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const togglePlaySong = (songId: string) => {
    setPlayingSongId(prev => prev === songId ? null : songId);
  };

  const toggleHeardStatus = (songId: string) => {
    setSongsList(prev =>
      prev.map(song => {
        if (song.id === songId) {
          const nextIsHeard = !song.isHeard;
          const nextEngagement = nextIsHeard
            ? Math.min(100, song.engagement + 15)
            : Math.max(0, song.engagement - 15);
          
          const updatedSong = {
            ...song,
            isHeard: nextIsHeard,
            engagement: nextEngagement,
          };

          // Also update the drawer state if this song is currently open in the drawer
          setSelectedSongForDrawer(current => 
            current?.id === songId ? updatedSong : current
          );

          return updatedSong;
        }
        return song;
      })
    );
  };

  const handleSuggestSubmit = (title: string, artist: string) => {
    const newSong: Song = {
      id: Math.random().toString(36).slice(2, 9),
      title,
      artist,
      category: 'sugestao',
      duration: '4:15',
      progress: '0:00',
      progressPct: 0,
      engagement: 0,
      isHeard: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Oeg-HSsmOqqLbpXgax9esSSi_MT7jCbWXIcl7AKDitPkcl1sG5jC0_zSzrx5k6nSMIyV8xuWKB5Ua02xSOK7LkgP8eOvmp22rAfvPPoUCKB5odE6VYp22xX2KQwWv7iYo0YEMBUP96E8GoKghcgzPEpqy9NKJU_bXrvZT7Zr95Ag9WohKbseD0AFxTTBWrcFbFGE3gEg-lw0nkd5EwyQAxE3N3AZfzVhxqBLTS1yNmCz2Pq0mD5VGcJ4z8Rkfyy-GeuFbS4j_Wc',
      suggestedBy: 'você'
    };

    setSongsList(prev => [newSong, ...prev]);
  };

  // Filter songs based on search and active tab
  const filteredSongs = songsList.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery) {
      return matchesSearch;
    }

    return song.category === activeCategoryTab;
  });

  const searchBar = (
    <div className="flex items-center w-full gap-2">
      <Button
        onClick={handleSearchClose}
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200 p-0"
        aria-label="Voltar"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl border-2 border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all duration-200 py-3 px-4">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Buscar em todas as abas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-on-surface font-body-lg text-body-lg border-none outline-none focus:outline-none focus:ring-0 focus:bg-transparent focus:border-none caret-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity shrink-0 bg-outline-variant/30 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const searchButton = (
    <Button
      onClick={handleSearchToggle}
      variant="ghost"
      size="sm"
      className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200 p-0"
      aria-label="Buscar música"
    >
      <span className="material-symbols-outlined text-[24px]">search</span>
    </Button>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showSearchView ? (
        <motion.div
          key="search-view"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
        >
          <SongSearchView
            onBack={() => setShowSearchView(false)}
            onSuggest={handleSuggestSubmit}
            existingSongs={songsList}
          />
        </motion.div>
      ) : (
        <motion.div
          key="songs-list"
          initial={{ x: '-30%' }}
          animate={{ x: 0 }}
          exit={{ x: '-30%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
          className="flex flex-col w-full bg-background text-on-background pb-32"
        >
          {/* Top AppBar */}
          {isSearchExpanded ? (
            <PageHeader title="Buscar">
              {searchBar}
            </PageHeader>
          ) : (
            <PageHeader
              title="Musicas"
              onBack={onBack}
              rightAction={searchButton}
            />
          )}

          {/* Main Body */}
          <main className="flex flex-col gap-6">
            {/* Quick Filters / Segmented Tabs Row */}
            {!searchQuery && (
              <SongsFilterTabs
                activeTab={activeCategoryTab}
                onTabChange={setActiveCategoryTab}
              />
            )}


            {/* Music List Section */}
            <section
              className="flex flex-col gap-4"
            >
              {searchQuery && (
                <div
                  className="flex justify-between items-center mb-2"
                >
                  <h2 className="text-label-lg font-semibold text-on-surface-variant">
                    Resultados da busca ({filteredSongs.length})
                  </h2>
                  <button
                    onClick={handleSearchClose}
                    className="text-label-sm font-bold text-primary hover:underline cursor-pointer"
                  >
                    Limpar busca
                  </button>
                </div>
              )}

              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isPlaying={playingSongId === song.id}
                    onPlayToggle={() => togglePlaySong(song.id)}
                    onHeardToggle={() => toggleHeardStatus(song.id)}
                    onEngagementClick={() => setSelectedSongForDrawer(song)}
                    showCategoryBadge={!!searchQuery}
                  />
                ))
              ) : (
                <div
                  className="flex flex-col items-center justify-center text-center opacity-60 py-12 gap-2"
                >
                  <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
                  <p className="text-body-lg font-medium">Nenhuma música encontrada</p>
                  <p className="text-label-sm">Tente buscar por outro termo ou limpe os filtros.</p>
                </div>
              )}
            </section>
          </main>

          {/* Team Engagement Drawer */}
          <EngagementDrawer
            isOpen={!!selectedSongForDrawer}
            song={selectedSongForDrawer}
            onClose={() => setSelectedSongForDrawer(null)}
          />

          {/* Floating Action Button (FAB) */}
          <AnimatePresence>
            {!searchQuery && activeCategoryTab === 'sugestao' && (
              <FloatingActionButton
                onClick={() => setShowSearchView(true)}
                icon={<span className="material-symbols-outlined text-[20px]">add</span>}
                label="Sugerir música"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SongsView;
