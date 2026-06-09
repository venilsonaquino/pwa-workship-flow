// ── Scales Domain Public API ───────────────────────────────────────────────────
// This is the ONLY import boundary for the scales domain.

export { default as ScalesPreviewView } from './views/ScalesPreviewView';
export { default as MonthSelector } from './components/MonthSelector';
export type { MonthSelectorProps, MonthOption } from './components/MonthSelector';
export { default as SongDistribution } from './components/SongDistribution';
export type { EventCard } from './components/SongDistribution';
export { default as ScalePreviewCard } from './components/ScalePreviewCard';
export type { BandMember, SongItem } from './components/ScalePreviewCard';
