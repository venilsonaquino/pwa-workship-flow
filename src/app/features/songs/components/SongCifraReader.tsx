import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@shared/components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Song } from '../types';

type TabOption = 'principal' | 'letra';

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

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function transposeNote(note: string, semitones: number): string {
  let idx = NOTES_SHARP.indexOf(note);
  if (idx === -1) {
    idx = NOTES_FLAT.indexOf(note);
  }
  if (idx === -1) return note;

  const newIdx = (idx + semitones + 12) % 12;
  const preferFlat = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'].includes(note);
  return preferFlat ? NOTES_FLAT[newIdx] : NOTES_SHARP[newIdx];
}

export function transposeChordToken(token: string, semitones: number): string {
  if (semitones === 0) return token;
  if (token.includes('/')) {
    return token.split('/').map(t => transposeChordToken(t, semitones)).join('/');
  }

  const match = token.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return token;
  const [_, root, suffix] = match;
  return transposeNote(root, semitones) + suffix;
}

export function transposeChordLine(line: string, semitones: number): string {
  if (semitones === 0) return line;
  const re = /[A-G][b#]?[0-9a-zA-Z()/#b]*/g;
  return line.replace(re, (match) => {
    if (isChordToken(match)) {
      return transposeChordToken(match, semitones);
    }
    return match;
  });
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
    <div className="">
      {showChords && (
        <pre
          className="text-primary font-mono whitespace-pre leading-tight"
          style={{
            fontWeight: 700,
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.6}px`,
          }}
        >
          {chords}
        </pre>
      )}
      <pre
        className="text-on-background whitespace-pre"
        style={{
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
  const [fontSize, setFontSize] = useState(18);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeedVal, setScrollSpeedVal] = useState(1.0);
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [activeControl, setActiveControl] = useState<'none' | 'scroll' | 'tom'>('none');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const accumScrollYRef = useRef(0);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const isUserTouchingRef = useRef(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAccumulatorRef = useRef(0);

  // Find the active scrollable container (.scroll-container-native or window)
  const getScrollContainer = (): HTMLElement | Window => {
    const container = document.querySelector('.scroll-container-native');
    return (container as HTMLElement) || window;
  };

  // Reset on close & scroll to top on open
  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    scrollAccumulatorRef.current = 0;
    if (!isOpen) {
      setIsScrolling(false);
      setActiveTab('principal');
      setTransposeOffset(0);
      setActiveControl('none');
      setIsControlsVisible(true);
    } else {
      const container = getScrollContainer();
      if (container instanceof Window) {
        window.scrollTo(0, 0);
      } else {
        container.scrollTop = 0;
      }
      setTransposeOffset(0);
      setActiveControl('none');
      setIsControlsVisible(true);
    }
  }, [isOpen, song]);

  // Auto-scroll engine using the appropriate container with requestAnimationFrame and time-delta
  useEffect(() => {
    if (!isScrolling) {
      // Reset transform when stopping
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.transform = '';
      }
      return;
    }

    const container = getScrollContainer();
    // Initialize float accumulator with the current scroll position
    accumScrollYRef.current = container instanceof Window ? window.scrollY : container.scrollTop;

    let lastTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      // Calculate elapsed time in seconds
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      // Cap delta time to prevent massive jumps when tab is blurred/backgrounded
      const cappedDelta = Math.min(deltaTime, 0.1);

      // Only increment the auto-scroll position if the user is NOT manually touching/dragging.
      // This suspends the auto-scrolling while they manually interact.
      if (!isUserTouchingRef.current) {
        const speedPixelsPerSecond = scrollSpeedVal * 12.0;
        accumScrollYRef.current += speedPixelsPerSecond * cappedDelta;
      }

      let currentScrollY = 0;
      let maxScroll = 0;

      const integerScroll = Math.floor(accumScrollYRef.current);
      const fraction = accumScrollYRef.current - integerScroll;

      // Apply subpixel translation to the content wrapper for GPU fluid rendering
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.transform = `translate3d(0, -${fraction}px, 0)`;
      }

      if (container instanceof Window) {
        window.scrollTo(0, integerScroll);
        currentScrollY = window.scrollY;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        container.scrollTop = integerScroll;
        currentScrollY = container.scrollTop;
        maxScroll = container.scrollHeight - container.clientHeight;
      }

      if (currentScrollY >= maxScroll - 10) {
        setIsScrolling(false);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      // Reset transform on cleanup
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.transform = '';
      }
    };
  }, [isScrolling, scrollSpeedVal]);

  // Touch & Wheel event listeners to identify manual user scroll and suspend programmatic updates
  useEffect(() => {
    if (!isOpen) return;

    const container = getScrollContainer();

    const handleTouchStart = () => {
      isUserTouchingRef.current = true;
    };
    const handleTouchEnd = () => {
      isUserTouchingRef.current = false;
    };
    const handleWheel = () => {
      // Wheel events instantly change scroll coordinates, so sync the accumulator
      accumScrollYRef.current = container instanceof Window ? window.scrollY : container.scrollTop;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  // Scroll tracker to show/hide bottom controls bar based on scroll direction
  useEffect(() => {
    if (!isOpen) return;

    const container = getScrollContainer();

    const handleScroll = () => {
      const currentScrollY = container instanceof Window ? window.scrollY : container.scrollTop;
      const lastScrollY = lastScrollYRef.current;

      // Sync accumulator if user manually scrolls via touch drag
      if (isScrolling && isUserTouchingRef.current) {
        accumScrollYRef.current = currentScrollY;
      }

      // Show always at the top of the page
      if (currentScrollY < 20) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
        setIsControlsVisible(true);
        scrollAccumulatorRef.current = 0;
      } else {
        const delta = currentScrollY - lastScrollY;
        if (delta > 0) {
          scrollAccumulatorRef.current = 0; // Reset up-scroll accumulator
          // Only schedule hide if currently visible and no hide timeout is already running
          if (isControlsVisible && !hideTimeoutRef.current) {
            hideTimeoutRef.current = setTimeout(() => {
              setIsControlsVisible(false);
              hideTimeoutRef.current = null;
            }, 1000);
          }
        } else if (delta < 0) {
          scrollAccumulatorRef.current += Math.abs(delta);
          // Only show controls if the up-scroll delta exceeds the 15px threshold
          if (scrollAccumulatorRef.current > 15) {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
            setIsControlsVisible(true);
            scrollAccumulatorRef.current = 0;
          }
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isOpen, isScrolling, activeControl, isControlsVisible]);

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
    tuning = line.substring(colonIdx + 1).trim().replace(/\s+/g, '    ');
    linesToParse = lines.filter((_, idx) => idx !== tuningIdx);
  }

  const segments = parseCifra(linesToParse);
  const showChords = activeTab === 'principal';

  return (
    <div className="w-full min-h-screen bg-background flex flex-col pb-10">

      {/* ── Header ────────────────────────────────────────────────── */}
      <PageHeader
        title={song.title}
        onBack={onClose}
        showBackButton={true}
      />

      <div ref={contentWrapperRef} style={{ willChange: 'transform' }}>
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
            style={{ fontSize: fontSize }}
            aria-label="Aumentar fonte"
          >
            A+
          </button>
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
              <div className="flex items-center gap-1 text-sm text-on-surface-variant mb-6">
                <span className='font-bold'>Tom:</span>
                <span className="font-bold text-primary">{song.tom ? transposeNote(song.tom, transposeOffset) : '—'}</span>
              </div>
            )}
            {tuning && (
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className=''>Afinação:</span>
                <span className="font-medium text-on-surface whitespace-pre">{tuning}</span>
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
            <div key={idx} className="mt-2 mb-2 flex items-center gap-2">
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
              chords={transposeChordLine(seg.chords, transposeOffset)}
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
                lineHeight: `${fontSize * 1.2}px`,
                margin: '0 0 12px'
              }}
            >
              {transposeChordLine(seg.chords, transposeOffset)}
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
      </div>
      <div className="h-20" />

      {/* Style overrides for custom range slider and GPU compositing */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .speed-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 6px;
          height: 16px;
          border-radius: 9999px;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          transition: transform 0.15s ease;
        }
        .speed-slider-input::-webkit-slider-thumb:active {
          transform: scaleY(1.3) scaleX(1.3);
        }
        .speed-slider-input::-moz-range-thumb {
          width: 6px;
          height: 16px;
          border: none;
          border-radius: 9999px;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          transition: transform 0.15s ease;
        }
        .speed-slider-input::-moz-range-thumb:active {
          transform: scaleY(1.3) scaleX(1.3);
        }
        .scroll-container-native {
          will-change: scroll-position;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}} />

      {/* ── Floating Controls Bar (Simplified: Scroll, Tom) ─── */}
      <motion.div
        className="fixed bottom-6 left-4 right-4 mx-auto max-w-sm z-[200]"
        animate={{
          y: isControlsVisible ? 0 : 80,
          opacity: isControlsVisible ? 1 : 0,
          scale: isControlsVisible ? 1 : 0.95
        }}
        style={{
          pointerEvents: isControlsVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {activeControl === 'none' && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#1c1b1f] text-white shadow-2xl rounded-full px-5 py-2.5 flex items-center justify-center gap-6 border border-white/10 mx-auto w-fit"
            >
              {/* Scroll */}
              <button
                onClick={() => {
                  setActiveControl('scroll');
                  if (!isScrolling) {
                    setIsScrolling(true);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-all active:scale-90 duration-100 min-w-[52px] ${isScrolling ? 'text-primary' : 'text-white'}`}
              >
                <span className="material-symbols-outlined text-[22px] leading-none">
                  {isScrolling ? 'pause' : 'play_arrow'}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-none opacity-80">Scroll</span>
              </button>

              {/* Divider */}
              <div className="w-px h-8 bg-white/15" />

              {/* Tom */}
              <button
                onClick={() => setActiveControl('tom')}
                className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-all active:scale-90 duration-100 min-w-[52px] text-white"
              >
                <span className="material-symbols-outlined text-[22px] leading-none">music_note</span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-none opacity-80">Tom</span>
              </button>
            </motion.div>
          )}

          {activeControl === 'scroll' && (
            <motion.div
              key="scroll"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-[#1c1b1f] text-white shadow-2xl rounded-full px-3 py-2 flex items-center justify-between border border-white/10"
            >
              {/* Play/Pause icon button */}
              <button
                onClick={() => setIsScrolling(s => !s)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 duration-100 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isScrolling ? 'pause' : 'play_arrow'}
                </span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1 flex-shrink-0" />

              {/* Slider section */}
              <div className="flex-1 flex items-center gap-3.5 px-2 min-w-0">
                <TurtleIcon className="w-5 h-5 text-white/50 flex-shrink-0" />

                {/* Range input slider */}
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={scrollSpeedVal}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setScrollSpeedVal(val);
                    console.log("[Cifra Scroll] Speed changed to:", val, "Actual pixels/tick:", val * 0.2);
                  }}
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(scrollSpeedVal / 2.0) * 100}%, rgba(255, 255, 255, 0.12) ${(scrollSpeedVal / 2.0) * 100}%, rgba(255, 255, 255, 0.12) 100%)`
                  }}
                  className="speed-slider-input flex-1 h-1.5 rounded-full appearance-none cursor-pointer outline-none transition-all"
                />

                <RabbitIcon className="w-5 h-5 text-white/50 flex-shrink-0" />
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1 flex-shrink-0" />

              {/* Close button */}
              <button
                onClick={() => setActiveControl('none')}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 duration-100 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </motion.div>
          )}

          {activeControl === 'tom' && (
            <motion.div
              key="tom"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#1c1b1f] text-white shadow-2xl rounded-full px-3 py-2 flex items-center border border-white/10 gap-2 min-w-[240px] mx-auto w-fit"
            >
              {/* Transpose Down */}
              <button
                onClick={() => setTransposeOffset(o => o - 1)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 duration-100 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>

              {/* Current Key display */}
              <div className="flex-1 flex flex-col items-center justify-center px-2 min-w-[70px]">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider leading-none mb-1">Tom</span>
                <span className="text-sm font-extrabold text-primary leading-none">
                  {song.tom ? transposeNote(song.tom, transposeOffset) : '—'}
                </span>
              </div>

              {/* Transpose Up */}
              <button
                onClick={() => setTransposeOffset(o => o + 1)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 duration-100 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1 flex-shrink-0" />

              {/* Close button */}
              <button
                onClick={() => setActiveControl('none')}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 duration-100 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Custom SVG Icons for Turtle and Rabbit ─────────────────────────
function TurtleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M3.4 18c.1-2 1.6-3.6 3.7-4.1-.1-.3-.1-.6-.1-1 0-3 2.2-5.5 5-5.9V5a2 2 0 1 1 4 0v2c2.8.4 5 2.9 5 5.9 0 .4 0 .7-.1 1 2.1.5 3.6 2.1 3.7 4.1.1 1.2-.7 2.2-1.9 2.2h-1c-.5 0-1-.3-1.2-.8-.6-1.1-1.8-1.7-3-1.5-1 .1-1.7.9-1.7 1.9v.4c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1v-.4c0-1-.7-1.8-1.7-1.9-1.2-.2-2.4.4-3 1.5-.2.5-.7.8-1.2.8h-1c-1.2 0-2-1-1.9-2.2Z" />
      <path d="M19 14h-1a2 2 0 0 0-2 2v1" />
      <path d="M5 14h1a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function RabbitIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 8.54V4a2 2 0 1 0-4 0v3" />
      <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1.93 1.93 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1c-1.7 0-3 1.3-3 3" />
      <path d="M7.61 12.53a3 3 0 1 0-1.6 4.3" />
      <path d="M13 16a3 3 0 0 1 2.24 5" />
      <path d="M18 12h.01" />
    </svg>
  );
}

export default SongCifraReader;

