import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import SongsFilterTabs from '../components/SongsFilterTabs';
import SongCard from '../components/SongCard';
import SongSearchView from './SongSearchView';
import EngagementDrawer from '../components/EngagementDrawer';
import SongCifraReader from '../components/SongCifraReader';
import { PageHeader, Button, FloatingActionButton, Header } from '@shared/components';
import { useSongsStore } from '../hooks/useSongsStore';
import { useAudioPlayer } from '@shared/hooks';
import type { Song, SongCategory } from '../domain/entities/Song';
import { getCategoryLabel } from '../domain/entities/Song';

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SongCardSkeleton = () => (
  <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 p-5 flex flex-col gap-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-20 h-20 rounded-lg bg-surface-container-high shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="h-4 bg-surface-container-high rounded-full w-3/4" />
        <div className="h-3 bg-surface-container-high rounded-full w-1/2" />
      </div>
      <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
    </div>
    <div className="h-1 bg-surface-container-high rounded-full" />
    <div className="h-8 bg-surface-container-high rounded-full" />
  </div>
);

// ── Empty State ────────────────────────────────────────────────────────────────

const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="flex flex-col items-center justify-center text-center opacity-60 py-12 gap-2">
    <span className="material-symbols-outlined text-[48px] text-outline">
      {searchQuery ? 'search_off' : 'music_off'}
    </span>
    <p className="text-body-lg font-medium">
      {searchQuery ? 'Nenhuma música encontrada' : 'Nenhuma música aqui ainda'}
    </p>
    <p className="text-label-sm">
      {searchQuery ? 'Tente buscar por outro termo.' : 'Que tal sugerir uma música?'}
    </p>
  </div>
);

// ── SongsView ──────────────────────────────────────────────────────────────────

export const SongsView = () => {
  const { songId } = useParams<{ songId: string }>();
  const {
    suggestions,
    evaluating,
    repertoire,
    isLoading,
    error,
    fetchSongs,
    markAsListened,
    changeCategory,
    deleteSong,
    getSongsByCategory,
  } = useSongsStore();
  const { currentSongId, isPlaying, currentTimeFormatted, progressPct, togglePlay, seekPct } = useAudioPlayer();

  const [activeCategoryTab, setActiveCategoryTab] = useState<SongCategory>('sugestao');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSearchView, setShowSearchView] = useState(false);
  const [selectedSongForDrawer, setSelectedSongForDrawer] = useState<Song | null>(null);
  const [selectedSongForCifra, setSelectedSongForCifra] = useState<Song | null>(null);
  const [autoPlayedSongId, setAutoPlayedSongId] = useState<string | null>(null);

  // Auto-open player and focus card when arriving via deeplink /songs/:songId
  useEffect(() => {
    if (!songId || autoPlayedSongId === songId) return;
    const allSongs = [...suggestions, ...evaluating, ...repertoire];
    const targetSong = allSongs.find((song) => song.id === songId);
    if (targetSong) {
      if (targetSong.category) {
        setActiveCategoryTab(targetSong.category);
      }
      setAutoPlayedSongId(songId);
      if (targetSong.audioUrl && currentSongId !== targetSong.id) {
        togglePlay(targetSong);
      }

      setTimeout(() => {
        const cardElement = document.getElementById(`song-card-${songId}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [songId, suggestions, evaluating, repertoire, togglePlay, currentSongId, autoPlayedSongId]);

  // Keep selectedSongForDrawer in sync with latest store data
  useEffect(() => {
    if (!selectedSongForDrawer) return;
    const allSongs = [...suggestions, ...evaluating, ...repertoire];
    const updated = allSongs.find((song) => song.id === selectedSongForDrawer.id);
    if (updated && (updated.hasListened !== selectedSongForDrawer.hasListened || updated.bandEngagementPercentage !== selectedSongForDrawer.bandEngagementPercentage)) {
      setSelectedSongForDrawer(updated);
    }
  }, [suggestions, evaluating, repertoire, selectedSongForDrawer]);

  const handleViewCifra = (song: Song) => {
    setSelectedSongForDrawer(null);
    setSelectedSongForCifra(song);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleHeardToggle = (song: Song) => {
    markAsListened(song.id);
  };

  const handleCategoryChange = (song: Song, newCategory: SongCategory) => {
    const previousCategory = song.category;
    changeCategory(song.id, newCategory);

    toast.success(`Música movida para ${getCategoryLabel(newCategory)}`, {
      action: {
        label: 'Desfazer',
        onClick: () => {
          changeCategory(song.id, previousCategory);
        },
      },
    });
  };

  const handleDeleteSong = async (song: Song) => {
    try {
      await deleteSong(song.id);
      toast.success(`Música "${song.title}" removida com sucesso.`);
    } catch {
      toast.error(`Falha ao remover a música "${song.title}".`);
    }
  };

  // Filter songs: search across all categories, or show active tab
  const visibleSongs = (): Song[] => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return [...suggestions, ...evaluating, ...repertoire].filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      );
    }
    return getSongsByCategory(activeCategoryTab);
  };

  const filteredSongs = visibleSongs();

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
      onClick={() => setIsSearchExpanded(!isSearchExpanded)}
      variant="ghost"
      size="sm"
      className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200 p-0"
      aria-label="Buscar música"
    >
      <span className="material-symbols-outlined text-[24px]">search</span>
    </Button>
  );

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {selectedSongForCifra ? (
          <motion.div
            key="cifra-reader"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
            className="bg-background"
          >
            <SongCifraReader
              isOpen={!!selectedSongForCifra}
              song={selectedSongForCifra}
              onClose={() => setSelectedSongForCifra(null)}
            />
          </motion.div>
        ) : showSearchView ? (
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
              onSuggest={() => { fetchSongs(); setShowSearchView(false); }}
              existingSongs={[...suggestions, ...evaluating, ...repertoire]}
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
              <PageHeader title="Buscar">{searchBar}</PageHeader>
            ) : (
              <Header
                title="Músicas"
                rightAction={searchButton}
                showNotification={true}
              />
            )}

            {/* Main Body */}
            <main className="flex flex-col gap-6">
              {!searchQuery && (
                <SongsFilterTabs
                  activeTab={activeCategoryTab}
                  onTabChange={setActiveCategoryTab}
                />
              )}

              {/* Error Banner */}
              {error && !isLoading && (
                <div className="flex flex-col items-center gap-3 py-8 text-center opacity-80">
                  <span className="material-symbols-outlined text-[40px] text-error/60">wifi_off</span>
                  <p className="text-body-md text-on-surface-variant">{error}</p>
                  <Button onClick={() => fetchSongs()} variant="outline" size="sm">
                    Tentar novamente
                  </Button>
                </div>
              )}

              {/* Music List Section */}
              <section className="flex flex-col gap-4">
                {searchQuery && (
                  <div className="flex justify-between items-center mb-2">
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

                {isLoading ? (
                  [1, 2, 3].map((key) => <SongCardSkeleton key={key} />)
                ) : filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => {
                    const isThisSongCurrent = currentSongId === song.id;
                    const isThisSongPlaying = isPlaying && isThisSongCurrent;
                    return (
                      <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={isThisSongPlaying}
                        isCurrentSong={isThisSongCurrent}
                        onPlayToggle={() => togglePlay(song)}
                        onHeardToggle={() => handleHeardToggle(song)}
                        onCategoryChange={(_songId, newCat) => handleCategoryChange(song, newCat)}
                        onDelete={() => handleDeleteSong(song)}
                        onClick={() => setSelectedSongForDrawer(song)}
                        showCategoryBadge={true}
                        progressPct={isThisSongCurrent ? progressPct : 0}
                        currentTimeFormatted={isThisSongCurrent ? currentTimeFormatted : '0:00'}
                        onSeekPct={seekPct}
                      />
                    );
                  })
                ) : (
                  !error && <EmptyState searchQuery={searchQuery} />
                )}
              </section>
            </main>


            {/* Team Engagement Drawer */}
            <EngagementDrawer
              isOpen={!!selectedSongForDrawer}
              song={selectedSongForDrawer}
              onClose={() => setSelectedSongForDrawer(null)}
              onViewCifra={handleViewCifra}
            />

            {/* Floating Action Button */}
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
    </>
  );
};

export default SongsView;
