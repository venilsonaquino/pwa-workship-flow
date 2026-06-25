import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@shared/components';
import type { Song } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────

type TabOption = 'principal' | 'letra';
type ScrollSpeed = 1 | 2 | 3;

// ─── Chord Shape Data ──────────────────────────────────────────────────────────

interface ChordShape {
  frets: [number, number, number, number, number, number];
  baseFret?: number;
  barre?: { fret: number; from: number; to: number };
}

const CHORD_SHAPES: Record<string, ChordShape> = {
  Dm7: { frets: [-1, -1, 0, 2, 1, 1] },
  Bb9: { frets: [-1, 1, 3, 1, 3, 1], barre: { fret: 1, from: 1, to: 5 } },
  F: { frets: [1, 3, 3, 2, 1, 1], barre: { fret: 1, from: 0, to: 5 } },
  F2: { frets: [-1, -1, 3, 0, 1, 3] },
  C4: { frets: [-1, 3, 3, 0, 1, 1] },
  'F7M': { frets: [-1, -1, 3, 2, 1, 0] },
  'F7M(9)': { frets: [-1, -1, 3, 2, 1, 0] },
  'F6': { frets: [-1, -1, 3, 2, 1, 2] },
  'C11/E': { frets: [0, 3, 3, 0, 3, 3], barre: { fret: 3, from: 1, to: 5 } },
};

// ─── SVG chord diagram constants ───────────────────────────────────────────────

const STR = 6;   // number of strings
const FRETS = 4;   // frets shown
const SS = 13;  // string spacing (px)
const FH = 14;  // fret height (px)
const PL = 12;  // left padding (for fret number)
const PM = 18;  // top margin for open/muted markers
const NUT = 3;   // nut thickness (px)
const SVGW = PL + (STR - 1) * SS + 6;
const SVGH = PM + NUT + FRETS * FH + 6;

// ─── ChordDiagram ──────────────────────────────────────────────────────────────

function ChordDiagram({ name, shape }: { name: string; shape: ChordShape }) {
  const bf = shape.baseFret ?? 1;
  const showNum = bf > 1;
  const sx = (i: number) => PL + i * SS;
  const fy = (f: number) => PM + NUT + f * FH;

  return (
    <div className="flex flex-col items-center flex-shrink-0 gap-1">
      <span className="text-[12px] font-bold text-primary leading-none">{name}</span>
      <svg width={SVGW} height={SVGH} viewBox={`0 0 ${SVGW} ${SVGH}`} style={{ overflow: 'visible' }}>

        {/* Fret number label */}
        {showNum && (
          <text x={PL - 3} y={fy(0) + FH / 2 + 4} fontSize={8} textAnchor="end" fill="var(--on-surface-variant)">{bf}</text>
        )}

        {/* Nut (thick) or open fret line */}
        {!showNum
          ? <rect x={PL} y={PM} width={(STR - 1) * SS} height={NUT} rx={1} fill="var(--on-surface)" />
          : <line x1={PL} y1={PM + NUT} x2={PL + (STR - 1) * SS} y2={PM + NUT} stroke="var(--outline-variant)" strokeWidth={1} />
        }

        {/* Fret lines */}
        {Array.from({ length: FRETS + 1 }, (_, f) => (
          <line key={f} x1={PL} y1={fy(f)} x2={PL + (STR - 1) * SS} y2={fy(f)} stroke="var(--outline-variant)" strokeWidth={0.8} />
        ))}

        {/* String lines */}
        {Array.from({ length: STR }, (_, s) => (
          <line key={s} x1={sx(s)} y1={PM} x2={sx(s)} y2={fy(FRETS)} stroke="var(--outline-variant)" strokeWidth={0.8} />
        ))}

        {/* Open / muted markers above nut */}
        {shape.frets.map((fret, s) => {
          if (fret === -1) {
            return (
              <text key={s} x={sx(s)} y={PM - 5} fontSize={10} textAnchor="middle" fill="var(--on-surface-variant)" fontFamily="sans-serif">x</text>
            );
          }
          if (fret === 0) {
            return (
              <circle key={s} cx={sx(s)} cy={PM - 8} r={3.5} fill="none" stroke="var(--on-surface-variant)" strokeWidth={1.2} />
            );
          }
          return null;
        })}

        {/* Barre bar */}
        {shape.barre && (() => {
          const rel = shape.barre.fret - bf + 1;
          if (rel < 1 || rel > FRETS) return null;
          const cy = fy(rel - 1) + FH / 2;
          return (
            <rect
              x={sx(shape.barre.from)} y={cy - 5.5}
              width={sx(shape.barre.to) - sx(shape.barre.from)}
              height={11} rx={5.5}
              fill="var(--primary)" opacity={0.9}
            />
          );
        })()}

        {/* Fretted note dots */}
        {shape.frets.map((fret, s) => {
          if (fret <= 0) return null;
          const rel = fret - bf + 1;
          if (rel < 1 || rel > FRETS) return null;
          const isBarreMiddle =
            shape.barre &&
            shape.barre.fret === fret &&
            s > shape.barre.from &&
            s < shape.barre.to;
          if (isBarreMiddle) return null;
          return <circle key={s} cx={sx(s)} cy={fy(rel - 1) + FH / 2} r={5.5} fill="var(--primary)" />;
        })}
      </svg>
    </div>
  );
}

// ─── Cifra parser ──────────────────────────────────────────────────────────────

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

function extractUniqueChords(lines: string[]): string[] {
  const seen = new Set<string>();
  const re = /[A-G][b#]?[0-9a-zA-Z()/#b]*/g;
  for (const line of lines) {
    if (!isChordLine(line)) continue;
    for (const m of line.matchAll(re)) {
      if (isChordToken(m[0])) seen.add(m[0]);
    }
  }
  return [...seen];
}

// ─── ChordLyricPair ────────────────────────────────────────────────────────────

interface PairProps {
  chords: string;
  lyrics: string;
  fontSize: number;
  showChords: boolean;
}

function ChordLyricPair({ chords, lyrics, fontSize, showChords }: PairProps) {
  const chordSize = Math.max(fontSize - 2, 10);
  return (
    <div className="mb-4">
      {showChords && (
        <pre
          className="text-primary font-mono whitespace-pre leading-tight"
          style={{ fontSize: `${chordSize}px`, margin: 0 }}
        >
          {chords}
        </pre>
      )}
      <pre
        className="text-on-background font-mono whitespace-pre leading-relaxed"
        style={{ fontSize: `${fontSize}px`, margin: 0 }}
      >
        {lyrics}
      </pre>
    </div>
  );
}

// ─── SongCifraReader ───────────────────────────────────────────────────────────

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
  const uniqueChords = extractUniqueChords(linesToParse);
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
            className={`px-2.5 py-1.5 flex items-center justify-center transition-all ${activeTab === 'principal' ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            aria-label="Salvar"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
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
            Lyrics
          </button>
          <div className="w-px h-5 bg-outline-variant" />
          <button className="px-3 py-1.5 flex items-center gap-0.5 text-on-surface-variant">
            <span className="text-sm">Mais</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
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
              className="text-primary font-mono whitespace-pre mb-3"
              style={{ fontSize: `${Math.max(fontSize - 2, 10)}px`, margin: '0 0 12px' }}
            >
              {seg.chords}
            </pre>
          );
        }

        return (
          <pre
            key={idx}
            className="text-on-background font-mono whitespace-pre"
            style={{ fontSize: `${fontSize}px`, margin: '0 0 4px' }}
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
