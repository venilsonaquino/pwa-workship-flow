// ── Scales Domain Public API ───────────────────────────────────────────────────
// This is the ONLY import boundary for the scales domain.

export { default as ScalesPreviewView } from './views/ScalesPreviewView';
export { default as SongDistribution, CARDS_DATA } from './components/SongDistribution';
export type { EventCard, SongDistributionProps } from './components/SongDistribution';
export { default as ScalePreviewCard } from './components/ScalePreviewCard';
export type { BandMember, SongItem } from './components/ScalePreviewCard';
