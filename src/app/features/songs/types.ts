export interface Song {
  id: string;
  title: string;
  artist: string;
  category: 'sugestao' | 'ensaiando' | 'repertorio';
  duration: string;
  progress: string;
  progressPct: number;
  engagement: number;
  isHeard: boolean;
  image: string;
}
