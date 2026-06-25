import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@shared/components';
import type { Song } from '../types';

type TabOption = 'principal' | 'letra';
type ScrollSpeed = 1 | 2 | 3;

const CHORD_RE = /^[A-G][b#]?[0-9a-zA-Z()/#b]*$/;

function isChordToken(t: string): boolean {
  return CHORD_RE.test(t);
}

function isChordLine(line: string): boolean {
  const clean = line.trim().replace(/[()]/g, '').trim();
  if (!clean) return false;
  const tokens = clean.split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every(isChordToken);
}

type CifraSegment =
  | { kind: 'header'; text: string }
  | { kind: 'pair'; chords: string; lyrics: string }
  | { kind: 'chord-only'; chords: string }
  | { kind: 'lyric'; text: string }
  | { kind: 'spacer' };

function parseCifra(lines: string[]): CifraSegment[] {
  const out: CifraSegment[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\[.+\]$/.test(line.trim())) {
      out.push({ kind: 'header', text: line.trim() });
      i++;
      continue;
    }
    if (!line.trim()) {
      out.push({ kind: 'spacer' });
      i++;
      continue;
    }
    if (isChordLine(line)) {
      const next = lines[i + 1];
      const nextIsLyric =
        next !== undefined &&
        !isChordLine(next) &&
        !/^\[.+\]$/.test(next.trim()) &&
        next.trim() !== '';
      if (nextIsLyric) {
        out.push({ kind: 'pair', chords: line, lyrics: next });
        i += 2;
      } else {
        out.push({ kind: 'chord-only', chords: line });
        i++;
      }
      continue;
    }
    out.push({ kind: 'lyric', text: line });
    i++;
  }
  return out;
}

interface PairProps {
  chords: string;
  lyrics: string;
  fontSize: number;
  showChords: boolean;
}

function ChordLyricPair({ chords, lyrics, fontSize, showChords }: PairProps) {
  return (
    <div className="mb-4">
      {showChords && (
        <pre
          className="text-primary font-mono whitespace-pre leading-tight"
        >
          {chords}
        </pre>
      )}
      <pre
        className="text-on-background whitespace-pre"
        style={{
          fontFamily: '"Roboto Mono", "Courier New", Courier, monospace',
          fontWeight: 400,
          fontSize: `${fontSize}px`,
          lineHeight: `${fontSize * 1.6}px`,
          margin: 0
        }}
      >
        {lyrics}
      </pre>
    </div>
  );
}

export interface SongCifraReaderProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
}

export function SongCifraReader({ isOpen, song, onClose }: SongCifraReaderProps) {
  const [activeTab, setActiveTab] = useState<TabOption>('principal');
  const [fontSize, setFontSize] = useState(14);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<ScrollSpeed>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset on close & scroll to top on open
  useEffect(() => {
    if (!isOpen) {
      setIsScrolling(false);
      setActiveTab('principal');
    } else {
      window.scrollTo(0, 0);
    }
  }, [isOpen, song]);

  // Auto-scroll engine using window scroll
  useEffect(() => {
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    if (!isScrolling) {
      stop();
      return stop;
    }
    const pxMap: Record<ScrollSpeed, number> = { 1: 0.5, 2: 1.2, 3: 2.5 };
    timerRef.current = setInterval(() => {
      window.scrollBy(0, pxMap[scrollSpeed]);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 10) {
        setIsScrolling(false);
      }
    }, 16);
    return stop;
  }, [isScrolling, scrollSpeed]);

  // Escape key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !song?.cifra) return null;

  const lines = song.cifra;

  // Extract tuning if present in the cipher lines
  let tuning: string | undefined = undefined;
  let linesToParse = lines;
  const tuningIdx = lines.findIndex(line =>
    line.toLowerCase().startsWith('afinação:') ||
    line.toLowerCase().startsWith('afinacao:') ||
    line.toLowerCase().startsWith('tuning:')
  );
  if (tuningIdx !== -1) {
    const line = lines[tuningIdx];
    const colonIdx = line.indexOf(':');
    tuning = line.substring(colonIdx + 1).trim();
    linesToParse = lines.filter((_, idx) => idx !== tuningIdx);
  }

  const segments = parseCifra(linesToParse);
  const showChords = activeTab === 'principal';

  return (
    <div className="w-full min-h-screen bg-background flex flex-col pb-24">

      {/* ── Header ────────────────────────────────────────────────── */}
      <PageHeader
        title={''}
        onBack={onClose}
        showBackButton={true}
      />

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-3 flex items-center gap-3">
        <div className="flex items-center border border-outline-variant rounded-2xl overflow-hidden">
          <button
            id="cifra-tab-principal"
            onClick={() => setActiveTab('principal')}
            className={`px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === 'principal'
              ? 'bg-surface-container text-on-surface'
              : 'text-on-surface-variant'
              }`}
          >
            Principal
          </button>
          <div className="w-px h-5 bg-outline-variant" />
          <button
            id="cifra-tab-letra"
            onClick={() => setActiveTab('letra')}
            className={`px-4 py-1.5 text-sm transition-all ${activeTab === 'letra'
              ? 'font-semibold text-on-surface'
              : 'text-on-surface-variant'
              }`}
          >
            Letras
          </button>
          <div className="w-px h-5 bg-outline-variant" />
        </div>

        {/* Font controls */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            id="cifra-font-decrease"
            onClick={() => setFontSize(s => Math.max(10, s - 1))}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-bold hover:bg-surface-container-high transition-colors"
            aria-label="Diminuir fonte"
          >
            A-
          </button>
          <button
            id="cifra-font-increase"
            onClick={() => setFontSize(s => Math.min(22, s + 1))}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors"
            style={{ fontSize: '13px' }}
            aria-label="Aumentar fonte"
          >
            A+
          </button>
        </div>
      </div>

      {/* ── Auto-scroll bar ──────────────────────────────────────── */}
      <div className="flex-shrink-0 py-2 flex items-center gap-2 bg-surface-container-lowest border-b border-outline-variant/10">
        <button
          id="cifra-scroll-toggle"
          onClick={() => setIsScrolling(s => !s)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isScrolling
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
        >
          <span className="material-symbols-outlined text-[14px] leading-none">
            {isScrolling ? 'pause' : 'play_arrow'}
          </span>
          Auto-scroll
        </button>
        <div className="flex gap-1">
          {([1, 2, 3] as ScrollSpeed[]).map(sp => (
            <button
              key={sp}
              onClick={() => setScrollSpeed(sp)}
              className={`w-7 h-7 rounded-full text-[11px] font-bold transition-all ${scrollSpeed === sp
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>

      {/* ── Cifra content ─────────────────────────────────────────── */}
      <div className="">
        <div className="flex-shrink-0 pb-8 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-on-background text-[18px] leading-tight truncate">
              {song.title}
            </h1>
            <p className="text-primary text-sm font-medium truncate">{song.artist}</p>
          </div>
        </div>

        {/* ── Tom & Afinação metadata ─────────────────────────────────── */}
        {(song.tom || tuning) && (
          <div className="flex-shrink-0 border-b border-outline-variant/10 flex flex-col gap-1.5">
            {song.tom && (
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span>Tom:</span>
                <span className="font-bold text-primary">{song.tom}</span>
              </div>
            )}
            {tuning && (
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span>Afinação:</span>
                <span className="font-medium text-on-surface">{tuning}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {segments.map((seg, idx) => {
        if (seg.kind === 'spacer') {
          return <div key={idx} className="h-3" />;
        }

        if (seg.kind === 'header') {
          return (
            <div key={idx} className="mt-7 mb-2 flex items-center gap-2">
              <div className="h-4 w-[3px] bg-primary rounded-full flex-shrink-0" />
              <span className="text-xs font-bold text-outline uppercase tracking-widest">
                {seg.text.replace(/[\[\]]/g, '')}
              </span>
            </div>
          );
        }

        if (seg.kind === 'pair') {
          return (
            <ChordLyricPair
              key={idx}
              chords={seg.chords}
              lyrics={seg.lyrics}
              fontSize={fontSize}
              showChords={showChords}
            />
          );
        }

        if (seg.kind === 'chord-only') {
          if (!showChords) return null;
          return (
            <pre
              key={idx}
              className="text-primary whitespace-pre"
              style={{
                fontFamily: '"Roboto Mono", "Courier New", Courier, monospace',
                fontWeight: 700,
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize * 1.6}px`,
                margin: '0 0 12px'
              }}
            >
              {seg.chords}
            </pre>
          );
        }

        return (
          <pre
            key={idx}
            className="text-on-background whitespace-pre"
            style={{
              fontFamily: '"Roboto Mono", "Courier New", Courier, monospace',
              fontWeight: 400,
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize * 1.6}px`,
              margin: '0 0 4px'
            }}
          >
            {seg.text}
          </pre>
        );
      })}
      <div className="h-16" />
    </div>
  );
}

export default SongCifraReader;
