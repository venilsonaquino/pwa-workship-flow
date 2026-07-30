import { useState, useEffect, useCallback } from 'react';
import { PageHeader, Button } from '@shared/components';
import { useAuth } from '@shared/hooks';
import { httpSongRepository } from '../infrastructure/repositories/HttpSongRepository';
import type { SongSearchResult } from '../domain/entities/SongSearch';
import type { Song } from '../domain/entities/Song';
import { formatDuration } from '../domain/entities/Song';

// ── Types ──────────────────────────────────────────────────────────────────────

type SuggestionState = 'idle' | 'loading' | 'success' | 'error';

interface SongSuggestionStatus {
  state: SuggestionState;
  errorMessage?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function isSongAlreadySuggested(result: SongSearchResult, existingSongs: Song[]): boolean {
  return existingSongs.some((s) => s.videoId === result.videoId);
}

// ── Sub-Components ─────────────────────────────────────────────────────────────

const SearchResultSkeleton = () => (
  <div className="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-2xl animate-pulse">
    <div className="w-14 h-14 rounded-xl bg-surface-container-high shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3.5 bg-surface-container-high rounded-full w-3/4" />
      <div className="h-3 bg-surface-container-high rounded-full w-1/2" />
    </div>
    <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
  </div>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface SongSearchViewProps {
  onBack: () => void;
  onSuggest: () => void;
  existingSongs: Song[];
}

// ── View ───────────────────────────────────────────────────────────────────────

const SongSearchView = ({ onBack, onSuggest, existingSongs }: SongSearchViewProps) => {
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SongSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestionStatus, setSuggestionStatus] = useState<Record<string, SongSuggestionStatus>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recent_song_searches');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  // ── Search Logic ─────────────────────────────────────────────────────────────

  const performSearch = useCallback(
    async (query: string, addToRecent = false) => {
      const trimmed = query.trim();
      if (!trimmed || !token) return;

      setIsSearching(true);
      setSearchError(null);
      setHasSearched(true);

      try {
        const data = await httpSongRepository.search(token, trimmed);
        setResults(data);

        if (addToRecent) {
          setRecentSearches((prev) => {
            const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
            const updated = [trimmed, ...filtered].slice(0, 5);
            try {
              localStorage.setItem('recent_song_searches', JSON.stringify(updated));
            } catch {
              // ignore storage errors
            }
            return updated;
          });
        }
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'Erro ao buscar músicas.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [token]
  );

  // Debounce: dispara busca 600ms após parar de digitar
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(() => {
      void performSearch(trimmed, false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // ── Suggest Logic ─────────────────────────────────────────────────────────────

  const handleSuggest = async (result: SongSearchResult) => {
    if (!token) return;

    setSuggestionStatus((prev) => ({ ...prev, [result.videoId]: { state: 'loading' } }));

    try {
      await httpSongRepository.suggest(token, {
        videoId: result.videoId,
        title: result.title,
        artist: result.artist,
        album: result.album,
        thumbnailUrl: result.thumbnailUrl,
        durationSeconds: result.durationSeconds,
      });

      setSuggestionStatus((prev) => ({ ...prev, [result.videoId]: { state: 'success' } }));

      // Notifica o pai para refrescar a lista de músicas
      onSuggest();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sugerir.';
      setSuggestionStatus((prev) => ({
        ...prev,
        [result.videoId]: { state: 'error', errorMessage: message },
      }));
    }
  };

  // ── Recent Searches ───────────────────────────────────────────────────────────

  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
    void performSearch(term, true);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try {
        localStorage.setItem('recent_song_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.setItem('recent_song_searches', JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  // ── Render helpers ─────────────────────────────────────────────────────────────

  const renderSuggestionButton = (result: SongSearchResult) => {
    const alreadySuggested = isSongAlreadySuggested(result, existingSongs);
    const status = suggestionStatus[result.videoId];

    if (alreadySuggested || status?.state === 'success') {
      return (
        <div className="w-10 h-10 flex items-center justify-center text-success shrink-0" title="Já sugerida">
          <span className="material-symbols-outlined text-[28px] icon-fill">check_circle</span>
        </div>
      );
    }

    if (status?.state === 'loading') {
      return (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[22px] animate-spin">progress_activity</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => void handleSuggest(result)}
        title="Sugerir esta música"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-90 shrink-0"
      >
        <span className="material-symbols-outlined icon-fill">add</span>
      </button>
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col w-full bg-background text-on-background pb-32 min-h-screen">
      <PageHeader title="Sugerir Música" onBack={onBack} showBackButton />

      <main className="px-5 flex flex-col gap-6 mt-4">
        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void performSearch(searchQuery, true);
          }}
          className="relative w-full group"
        >
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            autoFocus
            type="text"
            placeholder="Buscar música, artista ou álbum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-12 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setResults([]);
                setHasSearched(false);
                setSearchError(null);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </form>

        {/* Content */}
        <div className="flex flex-col gap-3">
          {/* Empty state: recent searches */}
          {!hasSearched && !isSearching && (
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-[12px] font-medium text-on-surface-variant/70 uppercase tracking-wider">
                  Buscas recentes
                </h2>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearAllRecent}
                    className="text-label-sm text-primary hover:underline px-2 py-1"
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
                      onClick={() => handleRecentClick(term)}
                      className={`flex items-center justify-between py-3 cursor-pointer transition-colors active:bg-surface-container-low hover:bg-surface-container-low/40 rounded-lg px-1 ${
                        index !== recentSearches.length - 1 ? 'border-b border-surface-container' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">history</span>
                        <span className="text-body-md text-on-surface font-medium">{term}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecent(e, term)}
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

          {/* Searching: skeleton */}
          {isSearching && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((k) => (
                <SearchResultSkeleton key={k} />
              ))}
            </div>
          )}

          {/* Error */}
          {searchError && !isSearching && (
            <div className="flex flex-col items-center gap-3 py-10 text-center opacity-80">
              <span className="material-symbols-outlined text-[40px] text-error/60">wifi_off</span>
              <p className="text-body-md text-on-surface-variant">{searchError}</p>
              <Button onClick={() => void performSearch(searchQuery, false)} variant="outline" size="sm">
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Results */}
          {hasSearched && !isSearching && !searchError && (
            <section className="flex flex-col gap-3">
              {results.length > 0 ? (
                <>
                  <h2 className="text-label-lg text-on-surface-variant uppercase tracking-wider">
                    {results.length} resultado{results.length !== 1 ? 's' : ''}
                  </h2>

                  {results.map((result) => (
                    <div
                      key={result.videoId}
                      className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:bg-surface-container-low transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
                        {result.thumbnailUrl ? (
                          <img
                            src={result.thumbnailUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">music_note</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-label-lg font-semibold text-on-surface truncate">
                          {result.title}
                        </h3>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          {result.artist}
                        </p>
                        <p className="text-[11px] text-outline mt-0.5">
                          {result.album} · {formatDuration(result.durationSeconds)}
                        </p>
                      </div>

                      {/* Action */}
                      {renderSuggestionButton(result)}
                    </div>
                  ))}

                  {/* Error de items individuais */}
                  {Object.entries(suggestionStatus).some(([, v]) => v.state === 'error') && (
                    <p className="text-label-sm text-error text-center py-2">
                      Falha ao sugerir uma ou mais músicas. Tente novamente.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center opacity-70 py-12 gap-3">
                  <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
                  <p className="text-body-lg font-semibold">Nenhuma música encontrada</p>
                  <p className="text-label-sm text-on-surface-variant">
                    Nenhum resultado para "{searchQuery}".
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SongSearchView;
