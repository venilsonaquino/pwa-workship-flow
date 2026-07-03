import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, Button } from '@shared/components';
import SuggestSongModal from '../components/SuggestSongModal';
import type { Song } from '../types';

interface LibrarySong {
  title: string;
  artist: string;
  duration: string;
  type: 'song';
  bgClass: string;
}

interface LibraryArtist {
  name: string;
  type: 'artist';
  songsCount: number;
  bgClass: string;
}

type LibraryItem = LibrarySong | LibraryArtist;

const LIBRARY_ITEMS: LibraryItem[] = [
  { title: 'Vitorioso És', artist: 'Gabriel Guedes', duration: '5:42', type: 'song', bgClass: 'bg-primary-container text-on-primary-container' },
  { title: 'A Casa é Sua', artist: 'Casa Worship', duration: '7:15', type: 'song', bgClass: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong United', duration: '8:56', type: 'song', bgClass: 'bg-tertiary-container text-on-tertiary-container' },
  { title: 'Lion', artist: 'Elevation Worship', duration: '6:15', type: 'song', bgClass: 'bg-primary-container text-on-primary-container' },
  { title: 'Graves Into Gardens', artist: 'Elevation Worship', duration: '7:32', type: 'song', bgClass: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Talking to Jesus', artist: 'Elevation Worship', duration: '5:10', type: 'song', bgClass: 'bg-tertiary-container text-on-tertiary-container' },
  { title: 'Todavia Me Alegrarei', artist: 'Samuel Messias', duration: '5:05', type: 'song', bgClass: 'bg-primary-container text-on-primary-container' },
  { title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong United', duration: '8:56', type: 'song', originalKey: 'D' },
  { title: 'Elevation Worship', artist: 'Artist Profile', duration: '--', type: 'song', originalKey: 'A' },
  { title: 'Me Atraiu', artist: 'Gabriela Rocha', duration: '6:12', type: 'song', originalKey: 'G' },
  { title: 'Yeshua', artist: 'Alessandro Vilas Boas', duration: '5:43', type: 'song', originalKey: 'C' },
  { title: 'A Casa É Sua', artist: 'Casa Worship', duration: '7:20', type: 'song', originalKey: 'G' },
  { title: 'Porque Ele Vive', artist: 'Traditional Hymn', duration: '4:15', type: 'song', originalKey: 'G' },
  { title: 'O Escudo', artist: 'Voz da Verdade', duration: '5:02', type: 'song', originalKey: 'Am' },
  { title: 'Grandes Coisas', artist: 'Fernandinho', duration: '5:24', type: 'song', originalKey: 'A' },
  { name: 'Hillsong United', songsCount: 42, type: 'artist' },
  { name: 'Gabriela Rocha', songsCount: 28, type: 'artist' },
  { name: 'Fernandinho', songsCount: 35, type: 'artist' },
  { name: 'Morada', songsCount: 19, type: 'artist' },
];

interface SongSearchViewProps {
  onBack: () => void;
  onSelectSong: (song: Song) => void;
}

export default ({
  onBack,
  onSelectSong,
}: SongSearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_song_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through
      }
    }
    const presets = ['Elevation Worship', 'Oceans (Where Feet May Fail)', 'Gabriel Guedes'];
    try {
      localStorage.setItem('recent_song_searches', JSON.stringify(presets));
    } catch {
      // ignore storage errors
    }
    return presets;
  });
  const [filteredResults, setFilteredResults] = useState<LibraryItem[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [addedSongKeys, setAddedSongKeys] = useState<Record<string, boolean>>({});

  // Reset search results immediately when input is empty during render
  const trimmedInput = searchQuery.trim();
  if (!trimmedInput && (searchedQuery !== '' || filteredResults.length > 0)) {
    setSearchedQuery('');
    setFilteredResults([]);
  }

  const saveRecentSearches = useCallback((newSearches: string[]) => {
    setRecentSearches(newSearches);
    localStorage.setItem('recent_song_searches', JSON.stringify(newSearches));
  }, []);

  const executeSearch = useCallback((query: string, addToRecent: boolean = false) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchedQuery('');
      setFilteredResults([]);
      return;
    }

    setSearchedQuery(trimmed);

    const lowercaseQuery = trimmed.toLowerCase();
    const filtered = LIBRARY_ITEMS.filter((item) => {
      if (item.type === 'song') {
        return (
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.artist.toLowerCase().includes(lowercaseQuery)
        );
      } else {
        return item.name.toLowerCase().includes(lowercaseQuery);
      }
    });

    setFilteredResults(filtered);

    if (addToRecent) {
      // Add to recent searches (move to top, limit to 5)
      setRecentSearches((prev) => {
        const filteredRecent = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filteredRecent].slice(0, 5);
        localStorage.setItem('recent_song_searches', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Debounce search while typing (500ms)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Skip debounce if we already have this exact search query active
    if (trimmed.toLowerCase() === searchedQuery.toLowerCase()) {
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(trimmed, false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchedQuery, executeSearch]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(searchQuery, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchedQuery('');
      setFilteredResults([]);
    }
  };

  const handleClearClick = () => {
    setSearchQuery('');
    setSearchedQuery('');
    setFilteredResults([]);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchQuery(term);
    executeSearch(term, true);
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    saveRecentSearches(updated);
  };

  const handleClearAllRecent = () => {
    saveRecentSearches([]);
  };

  const handleSuggestClick = (title: string, artist: string) => {
    onSuggest(title, artist);
    
    // Set feedback for added state
    const key = `${title.toLowerCase()}||${artist.toLowerCase()}`;
    setAddedSongKeys((prev) => ({ ...prev, [key]: true }));

    // Add current query to recent searches since they successfully interacted with it
    if (searchedQuery.trim()) {
      const filtered = recentSearches.filter((s) => s.toLowerCase() !== searchedQuery.toLowerCase());
      const updated = [searchedQuery, ...filtered].slice(0, 5);
      saveRecentSearches(updated);
    }
  };

  const isAlreadySuggested = (title: string, artist: string) => {
    const key = `${title.toLowerCase()}||${artist.toLowerCase()}`;
    if (addedSongKeys[key]) return true;

    return existingSongs.some(
      (s) =>
        s.title.toLowerCase() === title.toLowerCase() &&
        s.artist.toLowerCase() === artist.toLowerCase()
    );
  };

  const handleArtistClick = (artistName: string) => {
    setSearchQuery(artistName);
    executeSearch(artistName, true);
  };

  return (
    <div className="flex flex-col w-full bg-background text-on-background pb-32">
      {/* Top AppBar using the system's PageHeader */}
      <PageHeader
        title="Buscar Músicas"
        onBack={onBack}
        showBackButton={true}
      />

      <main className="px-5 flex flex-col gap-6 mt-4">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            className="w-full h-14 pl-12 pr-12 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-body-lg text-on-surface placeholder:text-on-outline focus:outline-none"
            placeholder="Música, álbum ou artista..."
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearClick}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Content Section */}
        <div id="search-content" className="w-full">
          {/* Initial State: Recent Searches */}
          {!searchedQuery && (
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-[12px] font-medium text-on-surface-variant/70">
                  buscas recentes
                </h2>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearAllRecent}
                    className="text-label-sm font-label-sm text-primary hover:underline px-2 py-1"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>
              
              {recentSearches.length > 0 ? (
                <div className="flex flex-col">
                  {recentSearches.map((term, index) => (
                    <div
                      key={`${term}-${index}`}
                      onClick={() => handleRecentSearchClick(term)}
                      className={`flex items-center justify-between py-3 cursor-pointer transition-colors active:bg-surface-container-low hover:bg-surface-container-low/40 ${
                        index !== recentSearches.length - 1 ? 'border-b border-surface-container' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">history</span>
                        <span className="text-body-md text-on-surface font-medium">{term}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecentSearch(e, term)}
                        className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-on-surface-variant transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant/60 text-body-md">
                  Nenhuma busca recente.
                </div>
              )}
            </section>
          )}

          {/* Results Section */}
          {searchedQuery && (
            <section className="flex flex-col gap-3">
              {filteredResults.length > 0 ? (
                <>
                  <h2 className="text-label-lg font-label-lg text-on-surface-variant uppercase tracking-wider mb-1">
                    Resultados da busca ({filteredResults.length})
                  </h2>

                  {filteredResults.map((item, index) => {
                    if (item.type === 'song') {
                      const suggested = isAlreadySuggested(item.title, item.artist);
                      return (
                        <div
                          key={`song-${item.title}-${index}`}
                          className="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer"
                        >
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${item.bgClass}`}>
                            <span className="material-symbols-outlined text-2xl">music_note</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-label-lg font-label-lg text-on-surface truncate">
                              {item.title}
                            </h3>
                            <p className="text-label-sm font-label-sm text-on-surface-variant truncate">
                              {item.artist} • {item.duration}
                            </p>
                          </div>
                          {suggested ? (
                            <div className="w-10 h-10 flex items-center justify-center text-success shrink-0" title="Já sugerida">
                              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSuggestClick(item.title, item.artist)}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-90 shrink-0"
                            >
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                add
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`artist-${item.name}-${index}`}
                          onClick={() => handleArtistClick(item.name)}
                          className="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer"
                        >
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/10 ${item.bgClass}`}>
                            <span className="material-symbols-outlined text-2xl">person</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-label-lg font-label-lg text-on-surface truncate">
                              {item.name}
                            </h3>
                            <p className="text-label-sm font-label-sm text-on-surface-variant truncate">
                              Artista • {item.songsCount} Músicas
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArtistClick(item.name);
                            }}
                            className="px-4 h-9 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-90 shrink-0 text-label-sm font-semibold"
                          >
                            Ver
                          </button>
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center opacity-70 py-12 gap-3">
                  <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
                  <p className="text-body-lg font-semibold">Nenhuma música encontrada</p>
                  <p className="text-label-sm">Não encontramos correspondências para "{searchQuery}".</p>
                </div>
              )}

              {/* Manual Suggestion Trigger Fallback */}
              <div className="mt-4 flex flex-col items-center border-t border-divider pt-6">
                <p className="text-body-md text-on-surface-variant mb-2">Não encontrou a música que procurava?</p>
                <Button
                  onClick={() => setIsManualModalOpen(true)}
                  variant="secondary"
                  size="sm"
                  className="px-5 border border-outline/30 hover:border-primary transition-colors text-primary font-bold"
                >
                  Sugerir manualmente
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Manual Suggestion Modal */}
      <SuggestSongModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={(title, artist) => {
          handleSuggestClick(title, artist);
          setIsManualModalOpen(false);
        }}
      />
    </div>
  );
};

export default SongSearchView;
